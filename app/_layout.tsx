import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '.././src/i18n/LanguageContext';
import { ThemeProvider } from '.././src/context/ThemeContext';
import { FavoritesProvider } from '.././src/context/FavoriteContext';
import { LastSeenProvider } from '.././src/context/LastSeenContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <FavoritesProvider>
            <LastSeenProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
              </Stack>
            </LastSeenProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}