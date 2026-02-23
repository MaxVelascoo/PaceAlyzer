'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Syne, Inter } from 'next/font/google';
import { useUser } from '@/context/userContext';
import { supabase } from '@/lib/supabaseClient';
import './styles.css';

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
        setHasStrava(false);
        return;
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

  const handleCTA = () => {
    if (!user) return router.push('/start');
    if (hasStrava === false) return router.push('/connect-strava');
    return router.push('/dashboard');
  };

  const ctaText = !user
    ? 'Empezar'
    : hasStrava === false
      ? 'Conectar con Strava'
      : 'Ir al Dashboard';

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div
          ref={heroRef}
          className={`heroInner fade-in-section ${heroVisible ? 'visible' : ''}`}
        >
          {/* Izquierda: Todo el texto */}
          <div className="heroLeft">
            <h1 className={`title ${syne.className}`}>
              ¡Analiza, Optimiza y <br /> supera tus límites!
            </h1>

            <p className={`subtitle ${inter.className}`}>
              Bienvenido a PaceAlyzer, tu entrenador virtual inteligente para ciclistas.
              Maximiza tu rendimiento con informes personalizados impulsados por IA.
            </p>

            <button className={`start-button ${syne.className}`} onClick={handleCTA}>
              {ctaText}
            </button>
          </div>

          {/* Derecha: Portátil */}
          <div className="heroRight">
            <div className="laptop">
              {/* Pantalla blanca - Aquí va tu imagen mockup */}
              <div className="laptopScreen">
                {/* Descomenta esto y pon tu imagen: */}
                { 
                <Image
                  src="/mockup-dashboard.png"
                  alt="PaceAlyzer Dashboard"
                  width={1200}
                  height={800}
                  className="laptopScreenImg"
                  priority
                />
                }
              </div>

              {/* Base inferior blanca (teclado) */}
              <div className="laptopBase">
                <div className="laptopBaseInner">
                  <div className="laptopNotch" />
                </div>
              </div>
              
              {/* Sombra */}
              <div className="laptopShadow" />
            </div>
          </div>
        </div>
      </section>

      {/* ACERCA DEL PRODUCTO */}
      <section
        id="acerca-del-producto"
        ref={productRef}
        className="product-section"
      >
        <div className={`productInner fade-in-section ${productVisible ? 'visible' : ''}`}>
          <header className="productHeader">
            <h2 className={syne.className}>Acerca del producto</h2>
            <p className={inter.className}>
              Descubre las características que hacen de PaceAlyzer el aliado ideal para ciclistas
              que buscan mejorar su rendimiento.
            </p>
          </header>

          <div className="featureGrid">
            <article className="featureCard">
              <div className="featureIcon gear" aria-hidden="true">⚙️</div>
              <h3 className={syne.className}>Entrenamiento Personalizado</h3>
              <p className={inter.className}>
                Planes de entreno adaptados a tu nivel y objetivos, ajustados según tu progreso.
              </p>
            </article>

            <article className="featureCard">
              <div className="featureIcon chat" aria-hidden="true">
                <Image
                  src="/pazey-logo.png"
                  alt=""
                  width={40}
                  height={40}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3 className={syne.className}>Chat con Pazey</h3>
              <p className={inter.className}>
                Ajusta entrenos con lenguaje natural y recibe consejos en tiempo real.
              </p>
            </article>

            <article className="featureCard">
              <div className="featureIcon chart" aria-hidden="true">📈</div>
              <h3 className={syne.className}>Análisis Avanzado</h3>
              <p className={inter.className}>
                Métricas claras y visuales para entender tu rendimiento y tu fatiga.
              </p>
            </article>

            <article className="featureCard">
              <div className="featureIcon spark" aria-hidden="true">✨</div>
              <h3 className={syne.className}>Optimización con IA</h3>
              <p className={inter.className}>
                Recomendaciones inteligentes basadas en tus datos para entrenar mejor.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
