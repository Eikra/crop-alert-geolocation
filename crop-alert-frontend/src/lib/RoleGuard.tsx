"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function RoleGuard({ children, role }: { children: ReactNode, role: string }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== role) {
      router.push('/');
    }
  }, [user, role, router]);

  if (!user || user.role !== role) return null;
  return <>{children}</>;
}
