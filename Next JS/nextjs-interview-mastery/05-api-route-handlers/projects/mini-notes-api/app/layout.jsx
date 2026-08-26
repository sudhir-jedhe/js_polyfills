export const metadata = {
  title: 'Mini Notes API',
  description: 'A minimal Next.js app demonstrating Route Handlers for a notes resource.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
