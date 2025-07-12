'use client';
import { useEffect } from 'react';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userContext = useUser();
  const router    = useRouter();

  // Si el contexto es undefined, no hacemos nada (cargando)
  if (!userContext) return null;
  const { user } = userContext;

 useEffect(() => {
  if (user === null) {
    router.replace('/start')
  }
}, [user, router])

// mientras user === undefined → devuelve null (cargando)
// si user === null → ya ha disparado replace() arriba
if (user === undefined || user === null) return null

return <>{children}</>

}

