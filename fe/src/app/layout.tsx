import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'APROQL — Approximate Query Processing Dashboard',
  description:
    'Visualize and compare exact vs approximate query execution performance, accuracy, and get intelligent recommendations for query optimization.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-mono antialiased bg-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
