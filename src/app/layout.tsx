import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alstom Transport Private Limited – Continuous Performance Management System',
  description: 'Enterprise Continuous Performance Management System (CPMS) for Alstom Transport Private Limited',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
