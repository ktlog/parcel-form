import type { Metadata } from 'next';
import './globals.css';
import './tokens.css';

export const metadata: Metadata = {
    title: 'Parcel Orders',
    description: 'Мини-приложение оформления доставки',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru">
            <body className="theme-page min-h-screen">
                <div className="mx-auto w-full max-w-3xl px-4 py-6">{children}</div>
            </body>
        </html>
    );
}
