"use client";
import './globals.css'
import { Inter } from 'next/font/google'
import ReactQueryProvider from '@/lib/ReactQueryProvider'
import { AuthProvider } from '@/context/AuthContext';


const inter = Inter({ subsets: ['latin'] })
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <nav className="flex justify-between items-center bg-blue-500 text-white px-8 py-4">
            <h1 className="font-bold text-lg">🌾 CropAlert</h1>
            <NavBar />
          </nav>
          <div>{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}

import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function NavBar() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  if (!user) {
    return (
      <div>
        <Link href="/login" className="mr-4">Login</Link>
        <Link href="/signup">Signup</Link>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center">
      <span>{user.email} ({user.role})</span>
      <Link href="/">Feed</Link>
      {user.role === 'AGRONOMIST' && (
        <>
          <Link href="/create-alert">Create Alert</Link>
          <Link href="/my-alerts">My Alerts</Link>
        </>
      )}
      <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
    </div>
  );
}



// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider>
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }


// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <ReactQueryProvider>
//           {children}
//         </ReactQueryProvider>
//       </body>
//     </html>
//   )
// }
