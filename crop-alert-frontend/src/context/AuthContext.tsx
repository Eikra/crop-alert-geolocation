
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

//  Define User type
type User = {
  id: number;
  email: string;
  role: string;
  token: string;
};

//  Define context type
type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// Create strongly typed context
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
          token,
        });
      } catch (e) {
        console.error("Failed to decode token", e);
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook stays same but fully typed
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// 'use client';
// import { createContext, useContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';


// const AuthContext = createContext(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       const decoded: any = jwtDecode(token);
//       setUser({
//         id: decoded.sub,
//         email: decoded.email,
//         role: decoded.role,
//         token,
//       });
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
