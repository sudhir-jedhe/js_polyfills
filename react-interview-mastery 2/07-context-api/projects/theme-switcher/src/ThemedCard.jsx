import { useTheme } from './ThemeContext.jsx';

export default function ThemedCard({ title, children }) {
  const { theme } = useTheme();

  return (
    <div className="themed-card">
      <p className="themed-card-eyebrow">Current theme: {theme}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
