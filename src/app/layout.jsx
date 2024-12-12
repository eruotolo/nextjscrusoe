import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Chubby Dashboard',
    description: 'Generated by create next app',
    icons: {
        icon: '/favicon.svg',
        apple: '/favicon.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/favicon.png',
        },
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
