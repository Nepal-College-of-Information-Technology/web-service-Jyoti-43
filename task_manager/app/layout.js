import './global.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Task Manager - CRUD App',
  description: 'A simple CRUD app built with Next.js and MongoDB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.12/dist/sweetalert2.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto">
            <a href="/" className="text-white text-xl font-bold">Task Manager</a>
          </div>
        </nav>
        {children}
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.12/dist/sweetalert2.all.min.js" async></script>
      </body>
    </html>
  );
}