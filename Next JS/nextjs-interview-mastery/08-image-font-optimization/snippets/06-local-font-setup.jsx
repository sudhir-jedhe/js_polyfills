// app/layout.jsx
import localFont from 'next/font/local';

const brandFont = localFont({
  src: [
    { path: '../fonts/Brand-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Brand-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-brand',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={brandFont.variable}>
      <body className={brandFont.className}>{children}</body>
    </html>
  );
}
