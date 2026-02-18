'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/userContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Syne, Space_Grotesk } from 'next/font/google';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './profile.module.css';
import { useToast } from '@/components/toastProvider/ToastProvider';


const syne = Syne({ subsets: ['latin'], weight: ['700'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'] });

type PerfilData = {
  firstname: string;
  lastname: string;
  email: string;
  telef: string;
  weight: number;
  ftp: number;
  avatar_url: string | null;
  birthdate: string;
  max_heartrate: number;
};

export default function PerfilPage() {
  const user = useUser()?.user;
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ telef: '', weight: '', ftp: '', birthdate: '', max_heartrate: '' });
  const toast = useToast();



  useEffect(() => {
    const fetchPerfil = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('firstname, lastname, email, telef, ftp, weight, birthdate, max_heartrate')
          .eq('id', user.id)
          .single();
        
        console.log('Profile fetch result:', { data, error, userId: user.id });
        
        if (error) {
          console.error('Error fetching profile:', error);
          toast('Error al cargar el perfil: ' + (error.message || 'Error desconocido'), 'error');
          setLoading(false);
          return;
        }
        
        if (data) {
          setPerfil({ ...data, avatar_url: null });
          setForm({
            telef: data.telef || '',
            weight: data.weight?.toString() || '',
            ftp: data.ftp?.toString() || '',
            birthdate: data.birthdate?.slice(0, 10) || '',
            max_heartrate: data.max_heartrate?.toString() || '',
          });
        }
      } catch (err) {
        console.error('Exception fetching profile:', err);
        toast('Error inesperado al cargar el perfil', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPerfil();
  }, [user, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .update({
        telef: form.telef,
        weight: Number(form.weight),
        ftp: Number(form.ftp),
        birthdate: form.birthdate,
        max_heartrate: Number(form.max_heartrate),
      })
      .eq('id', user.id);

    if (error) {
      toast('Error al guardar los cambios','error');
      return;
    }

    setPerfil(prev => prev ? { ...prev, ...form, weight: Number(form.weight), ftp: Number(form.ftp), max_heartrate: Number(form.max_heartrate) } : prev);
    setEditing(false);
    toast('Datos actualizados correctamente',);
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      if (!publicUrlData?.publicUrl) throw new Error('No public URL found');

      // TODO: Agregar columna avatar_url a la tabla users en Supabase
      toast('Foto subida correctamente (pendiente: agregar columna avatar_url a la BD)', 'error');
      
      setPerfil(prev =>
        prev ? { ...prev, avatar_url: publicUrlData.publicUrl } : prev
      );
    } catch (err) {
      console.error('Upload failed:', err);
      toast('Error al subir la imagen', 'error');
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
      <div className={`${styles.container} ${spaceGrotesk.className}`}>
        <h2 className={`${styles.heading} ${syne.className}`}>Tu Perfil</h2>
        {loading ? (
          <p>Cargando datos del perfil...</p>
        ) : perfil ? (
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

              {editing ? (
                <>
                  <label>Teléfono: <input name="telef" value={form.telef} onChange={handleChange} /></label>
                  <label>Peso (kg): <input name="weight" value={form.weight} onChange={handleChange} type="number" /></label>
                  <label>FTP (W): <input name="ftp" value={form.ftp} onChange={handleChange} type="number" /></label>
                  <label>Fecha de nacimiento: <input name="birthdate" value={form.birthdate} onChange={handleChange} type="date" /></label>
                  <label>FC máxima: <input name="max_heartrate" value={form.max_heartrate} onChange={handleChange} type="number" /></label>
                </>
              ) : (
                <>
                  <p><strong>Teléfono:</strong> {perfil.telef}</p>
                  <p><strong>Peso:</strong> {perfil.weight} kg</p>
                  <p><strong>FTP:</strong> {perfil.ftp} W</p>
                  <p><strong>Fecha de nacimiento:</strong> {perfil.birthdate?.slice(0, 10)}</p>
                  <p><strong>FC máxima:</strong> {perfil.max_heartrate} ppm</p>
                </>
              )}
            </div>

            {editing ? (
              <div className={styles.buttons}>
                <button onClick={handleUpdate} className={`${styles.save} ${syne.className}`}>Guardar cambios</button>
                <button onClick={() => setEditing(false)} className={`${styles.cancel} ${syne.className}`}>Cancelar</button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className={`${styles.edit} ${syne.className}`}>Editar perfil</button>
            )}

            <button onClick={handleLogout} className={`${styles.logout} ${syne.className}`}>Cerrar sesión</button>
          </>
        ) : (
          <p>No se pudieron cargar los datos del perfil.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
