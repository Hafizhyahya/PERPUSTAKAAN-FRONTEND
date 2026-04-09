import './globals.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
// lalu gunakan className={inter.className}
export const metadata = {
  title: 'Perpustakaan Digital',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
