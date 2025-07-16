'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/userContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Syne } from 'next/font/google';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './profile.module.css';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });

type PerfilData = {
  firstname: string;
  lastname: string;
  email: string;
  telef: string;
  weight: number;
  ftp: number;
  avatar_url: string | null;
};

export default function PerfilPage() {
  const user = useUser()?.user;
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('users')
        .select('firstname, lastname, email, telef, ftp, weight, avatar_url')
        .eq('id', user.id)
        .single();
      if (data && !error) setPerfil(data);
    };
    fetchPerfil();
  }, [user]);

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    setUploading(true);

    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // ✅ Subir imagen
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // ✅ Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) throw new Error('No public URL found');

      // ✅ Guardar URL en el perfil
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // ✅ Actualizar estado en React
      setPerfil(prev =>
        prev ? { ...prev, avatar_url: publicUrlData.publicUrl } : prev
      );
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };


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
            <div className={styles.avatarContainer}>
              {perfil.avatar_url ? (
                <img src={perfil.avatar_url} alt="Avatar" className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>Sube tu foto</div>
              )}
              <label className={styles.uploadLabel}>
                {uploading ? 'Cargando...' : 'Cambiar foto'}
                <input type="file" accept="image/*" onChange={uploadAvatar} hidden />
              </label>
            </div>
            <div className={styles.fields}>
              <p><strong>Nombre:</strong> {perfil.firstname}</p>
              <p><strong>Apellidos:</strong> {perfil.lastname}</p>
              <p><strong>Email:</strong> {perfil.email}</p>
              <p><strong>Teléfono:</strong> {perfil.telef}</p>
              <p><strong>Peso:</strong> {perfil.weight} kg</p>
              <p><strong>FTP:</strong> {perfil.ftp} W</p>
            </div>
            <button onClick={handleLogout} className={styles.logout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <p>Cargando datos del perfil...</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
