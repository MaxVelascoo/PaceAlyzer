'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Syne, Inter } from 'next/font/google';
import { useUser } from '@/context/userContext';
import { supabase } from '@/lib/supabaseClient';
import './styles.css';
import WorkflowVisual from './workflowVisual';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400'] });

const HomePage: React.FC = () => {
  const router = useRouter();
  const userContext = useUser();
  const user = userContext?.user;
  const heroRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  const [heroVisible, setHeroVisible] = useState(false);
  const [productVisible, setProductVisible] = useState(false);
  const [hasStrava, setHasStrava] = useState<boolean | null>(null);

  // Verifica si el usuario tiene Strava conectado
  useEffect(() => {
    const checkStrava = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('strava_accounts')
        .select('strava_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !data?.strava_id) {
        console.warn('No conectado a Strava');
        return setHasStrava(false);
      }
      setHasStrava(true);
    };

    checkStrava();
  }, [user]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);

    const productObserver = new IntersectionObserver(
      ([entry]) => setProductVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (productRef.current) productObserver.observe(productRef.current);

    return () => {
      observer.disconnect();
      productObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* Sección superior */}
      <div className="hero">
        <div
          ref={heroRef}
          className={`overlay fade-in-section ${heroVisible ? 'visible' : ''}`}
        >
          {/*<h1 className={`title ${syne.className}`}>¡Analiza, Optimiza y <br /> supera tus límites!</h1>*/}
          <h1 className={`title ${syne.className}`}>¡Analiza, Optimiza y <br /> supera tus límites!</h1>
          <p className={`subtitle ${inter.className}`}>
            Bienvenido a PaceAlyzer, tu entrenador virtual inteligente para ciclistas. <br />
            Maximiza tu rendimiento con informes personalizados impulsados por IA.
          </p>

          {/* Botón dinámico según estado de sesión y Strava */}
          {!user ? (
            <button className={`start-button ${syne.className}`} onClick={() => router.push('/start')}>
              Empezar
            </button>
          ) : hasStrava === false ? (
            <button className={`start-button ${syne.className}`} onClick={() => router.push('/connect-strava')}>
              Conectar con Strava
            </button>
          ) : (
            <button className={`start-button ${syne.className}`} onClick={() => router.push('/dashboard')}>
              Ir al Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Sección inferior */}
      <div
        id="acerca-del-producto"
        ref={productRef}
        className="product-section"
      >
        <div className={`product-content fade-in-section ${productVisible ? 'visible' : ''}`}>
          <div className="product-text">
            <h2 className={syne.className}>Acerca del producto</h2>
            <p className={inter.className}>
              PaceAlyzer es una plataforma que transforma tus datos de ciclismo en recomendaciones inteligentes de entrenamiento. Conéctate a Strava y recibe análisis detallados, seguimiento de progresos y sugerencias personalizadas para maximizar tu rendimiento.
            </p>
          </div>

          {/* Diagrama de workflow visual */}
          <WorkflowVisual />
        </div>
      </div>
    </>
  );
};

export default HomePage;
