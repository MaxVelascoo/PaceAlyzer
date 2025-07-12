'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/userContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Syne } from 'next/font/google';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './profile.module.css';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });

export default function PerfilPage() {
  const userContext = useUser();
  const user = userContext?.user;
  const router = useRouter();
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('users')
        .select('firstname, lastname, email, telef, ftp, weight')
        .eq('id', user.id)
        .single();

      if (!error) setPerfil(data);
    };

    fetchPerfil();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  return (
    <ProtectedRoute>
      <div className={`${styles.container} ${syne.className}`}>
        <h2 className={styles.heading}>Tu Perfil</h2>
        {perfil ? (
          <>
            <p className={styles.field}>Nombre: {perfil.firstname}</p>
            <p className={styles.field}>Apellidos: {perfil.lastname}</p>
            <p className={styles.field}>Email: {perfil.email}</p>
            <p className={styles.field}>Teléfono: {perfil.telef}</p>
            <p className={styles.field}>Peso: {perfil.weight} kg</p>
            <p className={styles.field}>FTP: {perfil.ftp} W</p>
            <button onClick={handleLogout} className={styles.logout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <p className={styles.field}>Cargando datos del perfil...</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
