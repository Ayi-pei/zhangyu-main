import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { SettingsProvider } from "./context/SettingsContext";
import Home from "./pages/Home";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <SettingsProvider>
          <Home />
        </SettingsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
