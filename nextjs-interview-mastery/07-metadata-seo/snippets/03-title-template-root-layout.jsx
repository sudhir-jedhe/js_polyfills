// app/layout.jsx
export const metadata = {
  title: {
    default: 'Acme Inc',
    template: '%s | Acme Inc',
  },
  description: 'Acme Inc — tools for modern teams.',
  metadataBase: new URL('https://acme.example.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// A descendant page setting `title: 'Pricing'` renders <title>Pricing | Acme Inc</title>
// A page needing NO suffix uses title: { absolute: 'Sign In' } to opt out of the template.
