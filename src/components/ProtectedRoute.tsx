'use client';
import { useEffect } from 'react';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userContext = useUser();
  const user = userContext?.user;
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace('/start');
    }
  }, [user, router]);

  if (!user) return null; // No mostrar nada mientras redirige

  return <>{children}</>;
}
