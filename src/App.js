// App.js
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/navigation";
import { LanguageProvider } from "./src/i18n/LanguageContext";
// ThemeProvider sudah ada di dalam Navigation, jadi tidak perlu ditambahkan lagi di sini

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <Navigation /> 
      </LanguageProvider>
    </SafeAreaProvider>
  );
}