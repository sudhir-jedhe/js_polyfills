import { useTheme } from './ThemeContext.jsx';

export default function ThemedButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="themed-button" onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
