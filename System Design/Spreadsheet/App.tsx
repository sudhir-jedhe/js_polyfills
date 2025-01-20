import React from 'react';
import Spreadsheet from './components/Spreadsheet';
import { ThemeProvider } from "./components/theme-provider"

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-primary text-primary-foreground p-4">
          <h1 className="text-2xl font-bold">Google Sheets Clone</h1>
        </header>
        <main className="p-4">
          <Spreadsheet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;

