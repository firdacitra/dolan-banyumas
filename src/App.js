// App.js
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "../src/navigation";
import { LanguageProvider } from "../src/i18n/LanguageContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <Navigation /> 
      </LanguageProvider>
    </SafeAreaProvider>
  );
}