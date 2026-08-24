// app/layout.jsx
// A Google font for body copy plus a local brand font for headings,
// both self-hosted, both exposed as CSS variables.
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const brandDisplay = localFont({
  src: '../fonts/BrandDisplay.woff2',
  variable: '--font-display',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${brandDisplay.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

// globals.css
// h1, h2, h3 { font-family: var(--font-display); }
