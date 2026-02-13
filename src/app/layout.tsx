import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Feature Request Board',
  description: 'Internal tool for tracking feature requests',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-4">
            <a href="/feature-requests" className="text-lg font-bold tracking-tight text-gray-900 hover:text-blue-600">
              Feature Request Board
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
