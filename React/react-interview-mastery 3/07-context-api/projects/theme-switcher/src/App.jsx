import { ThemeProvider } from './ThemeContext.jsx';
import ThemedButton from './ThemedButton.jsx';
import ThemedCard from './ThemedCard.jsx';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <main className="app-shell">
        <h1>Theme Switcher</h1>
        <p>
          A minimal, real, runnable demo of the Context API: <code>createContext</code>
          {' '}+ a <code>useTheme()</code> custom hook wrapping <code>useContext</code>,
          consumed by two independent components that never pass theme as a prop
          to each other.
        </p>
        <ThemedButton />
        <ThemedCard title="Why this works">
          Both <code>ThemedButton</code> and <code>ThemedCard</code> call{' '}
          <code>useTheme()</code> directly — neither receives <code>theme</code> as a
          prop, and neither is a parent or child of the other. <code>App</code> only
          needs to know about <code>ThemeProvider</code>, not about theme itself.
        </ThemedCard>
      </main>
    </ThemeProvider>
  );
}
