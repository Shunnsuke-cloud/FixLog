import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../src/lib/AuthProvider';
import HeaderNav from '../src/components/HeaderNav';

export const metadata: Metadata = {
  title: 'FixLog',
  description: 'エラーと解決方法を環境情報付きで共有・蓄積するナレッジ共有アプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <HeaderNav />
          <main className="container py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
