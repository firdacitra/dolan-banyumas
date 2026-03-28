// src/context/LastSeenContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LastSeenContext = createContext();

export const useLastSeen = () => useContext(LastSeenContext);

// Helper: ambil tanggal lokal format YYYY-MM-DD (bukan UTC)
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const LastSeenProvider = ({ children }) => {
  const [lastSeenItems, setLastSeenItems] = useState([]);

  useEffect(() => {
    loadLastSeen();
  }, []);

  const loadLastSeen = async () => {
    try {
      const data = await AsyncStorage.getItem('lastSeenItems');
      if (data) {
        setLastSeenItems(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading last seen:', error);
    }
  };

  const saveLastSeen = async (items) => {
    try {
      await AsyncStorage.setItem('lastSeenItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving last seen:', error);
    }
  };

  const addToLastSeen = (item) => {
    const today = getLocalDateString(); // tanggal lokal device, bukan UTC

    const normalizedItem = {
      id: item.id,
      name: item.name || item.title || 'Tanpa Nama',
      category: item.category || 'Umum',
      address: item.address || item.addres || 'Alamat tidak tersedia',
      rating: item.rating || 0,
      image: item.image || null,
      description: item.description || '',
      lastSeenDate: today,
      lastSeenTime: new Date().toISOString(),
    };

    setLastSeenItems(prevItems => {
      const filtered = prevItems.filter(i => i.id !== item.id);
      const updated = [normalizedItem, ...filtered];
      const limited = updated.slice(0, 50);
      saveLastSeen(limited);
      return limited;
    });
  };

  const getLastSeenByDate = (date) => {
    const targetDate = typeof date === 'string' ? date : getLocalDateString(date);
    return lastSeenItems.filter(item => item.lastSeenDate === targetDate);
  };

  const getLastSeenGroupedByDate = () => {
    const grouped = {};
    lastSeenItems.forEach(item => {
      if (!grouped[item.lastSeenDate]) {
        grouped[item.lastSeenDate] = [];
      }
      grouped[item.lastSeenDate].push(item);
    });
    return grouped;
  };

  const getLastSeenByFilter = (filter) => {
    const today = new Date();
    const todayStr = getLocalDateString(today);

    switch(filter) {
      case 'all':
        return lastSeenItems;

      case 'today':
        return lastSeenItems.filter(item => item.lastSeenDate === todayStr);

      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getLocalDateString(yesterday);
        return lastSeenItems.filter(item => item.lastSeenDate === yesterdayStr);
      }

      case 'lastweek': {
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastWeekStr = getLocalDateString(lastWeek);
        return lastSeenItems.filter(item =>
          item.lastSeenDate >= lastWeekStr && item.lastSeenDate < todayStr
        );
      }

      case 'lastmonth': {
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthStr = getLocalDateString(lastMonth);
        return lastSeenItems.filter(item =>
          item.lastSeenDate >= lastMonthStr && item.lastSeenDate < todayStr
        );
      }

      default:
        return lastSeenItems;
    }
  };

  const clearAllLastSeen = async () => {
    setLastSeenItems([]);
    await AsyncStorage.removeItem('lastSeenItems');
  };

  return (
    <LastSeenContext.Provider value={{
      lastSeenItems,
      addToLastSeen,
      getLastSeenByDate,
      getLastSeenGroupedByDate,
      getLastSeenByFilter,
      clearAllLastSeen,
    }}>
      {children}
    </LastSeenContext.Provider>
  );
};