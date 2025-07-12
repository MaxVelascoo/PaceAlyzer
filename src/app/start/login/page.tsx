'use client';
import React, { useState, useContext } from 'react';
import { Syne, Inter } from 'next/font/google';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400'] });

// Import your UserContext from its location
import { UserContext } from '@/context/userContext';

export default function LoginPage() {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const isReady = form.email.trim() !== '' && form.password.trim() !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  });

  if (error) return alert('Error al iniciar sesión: ' + error.message);

  // 🔄 Refrescar contexto manualmente
  const { data: userData } = await supabase.auth.getUser();
  userContext?.setUser(userData?.user ?? null);

  router.push('/dashboard');
};



  return (
    <div className={`form-container ${syne.className}`}>
      <h2>Iniciar sesión</h2>
      <form className="form">
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className={inter.className}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className={inter.className}
        />
        <button
          type="button"
          disabled={!isReady}
          onClick={handleLogin}
          className="form-button"
        >
          Iniciar sesión
        </button>
      </form>
      <p className={`${syne.className} login-register-hint`}>
        ¿No tienes cuenta?{' '}
        <Link href="/start/register" className="register-link">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
