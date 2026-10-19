'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [esOscuro, setEsOscuro] = useState(true)

  useEffect(() => {
    const temaGuardado = localStorage.getItem('tema_porcicultores')
    if (temaGuardado) {
      setEsOscuro(temaGuardado === 'oscuro')
    }
  }, [])

  const cambiarTema = () => {
    const nuevoTema = !esOscuro
    setEsOscuro(nuevoTema)
    localStorage.setItem('tema_porcicultores', nuevoTema ? 'oscuro' : 'claro')
  }

  // Paleta inteligente según el modo elegido
  const t = {
    bgPrincipal: esOscuro ? '#0B132B' : '#F1F5F9',
    bgHeader: '#0B2545',
    textPrincipal: esOscuro ? '#FFFFFF' : '#0F172A',
    textSecundario: esOscuro ? '#94A3B8' : '#64748B',
    bgTarjeta: esOscuro ? '#111936' : '#FFFFFF',
    bordeTarjeta: esOscuro ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
    textoHeroDesc: '#DCE6F1',
    bordeNeonVerde: esOscuro ? 'rgba(74, 222, 128, 0.4)' : '#16A34A',
    sombraNeonVerde: esOscuro ? '0 0 25px rgba(74, 222, 128, 0.15)' : '0 4px 12px rgba(22, 163, 74, 0.15)',
    bordeNeonAzul: esOscuro ? 'rgba(56, 189, 248, 0.4)' : '#0284C7',
    sombraNeonAzul: esOscuro ? '0 0 25px rgba(56, 189, 248, 0.15)' : '0 4px 12px rgba(2, 132, 199, 0.15)',
    bordeNeonMorado: esOscuro ? 'rgba(232, 121, 249, 0.4)' : '#C084FC',
    sombraNeonMorado: esOscuro ? '0 0 25px rgba(232, 121, 249, 0.15)' : '0 4px 12px rgba(192, 132, 252, 0.15)',
    bgMiniBox: esOscuro ? '#0B132B' : '#F8FAFC',
    svgStroke: esOscuro ? '#E2E8F0' : '#334155'
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: t.bgPrincipal, fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", margin: 0, padding: 0, color: t.textPrincipal, transition: 'background-color 0.3s ease' }}>
      
      {/* Navbar Superior Original */}
      <header style={{ backgroundColor: t.bgHeader, color: '#FFFFFF', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#FFFFFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            🐷
          </div>
          <span style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '0.5px' }}>
            PORCICULTORES RD
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <nav style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '14px', fontWeight: '600' }}>
            <Link href="/marketplace" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Marketplace</Link>
            <Link href="/directorio" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Directorio</Link>
            <Link href="/precios" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Precios</Link>
            <Link href="/perfil" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Mi Perfil</Link>
          </nav>

          <button
            onClick={cambiarTema}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {esOscuro ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
        </div>
      </header>

      {/* Hero Banner Principal (Azul) */}
      <section style={{ backgroundColor: t.bgHeader, color: '#FFFFFF', padding: '60px 20px 70px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '38px', fontWeight: '900', lineHeight: '1.2', margin: '0 0 16px 0' }}>
            Impulsando tu Negocio<br />Porcino Dominicano
          </h1>
          <p style={{ fontSize: '16px', color: t.textoHeroDesc, maxWidth: '650px', margin: '0 auto 32px auto', lineHeight: '1.5', opacity: 0.9 }}>
            Conectamos productores, compradores y servicios para un mercado más justo y transparente en la República Dominicana.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/marketplace"
              style={{ backgroundColor: '#C81D25', color: '#FFFFFF', fontWeight: '700', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.15)' }}
            >
              Ver Marketplace
            </Link>
            <Link
              href="/precios"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', fontWeight: '600', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Consultar Precios por Provincia
            </Link>
          </div>
        </div>
      </section>

      {/* Contenedor Inferior Tecnológico */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 60px 20px' }}>

        {/* 3 Tarjetas Superiores con los Dibujos Vectoriales Exactos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '45px' }}>
          
          {/* Tarjeta 1: Marketplace con Cerditos Ilustrados */}
          <Link href="/marketplace" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              backgroundColor: t.bgTarjeta, 
              borderRadius: '20px', 
              padding: '28px', 
              border: `1px solid ${t.bordeNeonVerde}`, 
              boxShadow: t.sombraNeonVerde,
              height: '100%', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                  <svg width="90" height="42" viewBox="0 0 120 60" fill="none" stroke={t.svgStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Cerdito grande */}
                    <path d="M75 30 C75 20 95 20 95 30 C105 30 110 38 105 45 L95 45 L95 52 L85 52 L85 45 L70 45 L70 52 L60 52 L60 45 C55 38 65 30 75 30 Z" fill="none"/>
                    <circle cx="98" cy="28" r="2"/>
                    <path d="M105 32 Q112 33 108 38"/>
                    {/* Lechones pequeños */}
                    <path d="M25 38 C25 32 35 32 35 38 C40 38 43 43 40 48 L35 48 L35 52 L30 52 L30 48 L22 48 L22 52 L18 52 L18 48 C15 43 20 38 25 38 Z"/>
                    <path d="M55 42 C55 38 62 38 62 42 C66 42 68 46 66 50 L62 50 L62 54 L58 54 L58 50 L52 50 L52 54 L48 54 L48 50 C46 46 50 42 55 42 Z"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Marketplace Porcino</h3>
                <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>
                  Compra y vende cerdos, lechones y reproductores de forma directa.
                </p>
              </div>
            </div>
          </Link>

          {/* Tarjeta 2: Directorio con Estetoscopio, Cruz y Trigo */}
          <Link href="/directorio" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              backgroundColor: t.bgTarjeta, 
              borderRadius: '20px', 
              padding: '28px', 
              border: `1px solid ${t.bordeNeonAzul}`, 
              boxShadow: t.sombraNeonAzul,
              height: '100%', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                  <svg width="105" height="42" viewBox="0 0 130 60" fill="none" stroke={t.svgStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Estetoscopio */}
                    <path d="M25 12 C15 12 12 22 18 32 C22 38 25 42 25 48 C25 53 20 56 16 56"/>
                    <circle cx="16" cy="56" r="4"/>
                    {/* Cruz */}
                    <path d="M55 20 V40 M45 30 H65" strokeWidth="3"/>
                    {/* Trigo / Planta */}
                    <path d="M95 50 V15 M95 25 Q105 20 102 15 M95 32 Q85 27 88 22 M95 40 Q105 35 102 30"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Directorio de Servicios</h3>
                <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>
                  Veterinarios, agroveterinarias y servicios para el fomento del sector.
                </p>
              </div>
            </div>
          </Link>

          {/* Tarjeta 3: Precios por Provincia con Gráficos y Mapa */}
          <Link href="/precios" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              backgroundColor: t.bgTarjeta, 
              borderRadius: '20px', 
              padding: '28px', 
              border: `1px solid ${t.bordeNeonMorado}`, 
              boxShadow: t.sombraNeonMorado,
              height: '100%', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                  <svg width="105" height="42" viewBox="0 0 130 60" fill="none" stroke={t.svgStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Gráfico de barras */}
                    <path d="M15 50 V30 M25 50 V18 M35 50 V38 M10 50 H42"/>
                    {/* Tendencia ascendente */}
                    <path d="M70 42 L82 30 L92 36 L108 16 M98 16 H108 V26"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Precios por Provincia</h3>
                <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>
                  Precios de referencia por libra/kilo actualizados por provincia.
                </p>
              </div>
            </div>
          </Link>

        </div>

        {/* Sección de Novedades y Noticias con Dibujo de Balanza */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: t.textPrincipal, marginBottom: '20px' }}>Novedades y Noticias</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
            
            {/* Noticia 1 */}
            <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '24px', border: `1px solid ${t.bordeTarjeta}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: t.textPrincipal, margin: '0 0 4px 0' }}>Nuevo Filtro por Peso Añadido al Marketplace</h4>
                <span style={{ fontSize: '12px', color: t.textSecundario, display: 'block', marginBottom: '10px' }}>16 dic 2026</span>
                <p style={{ fontSize: '13px', color: t.textSecundario, margin: '0 0 16px 0', lineHeight: '1.4' }}>
                  Guía de Seguridad: Cómo Evitar Estafas en transacciones comerciales. Compro y vención de filtro y preso añadido al marketplace.
                </p>
                <Link href="/marketplace" style={{ backgroundColor: esOscuro ? '#1E293B' : '#F1F5F9', color: t.textPrincipal, padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', border: `1px solid ${t.bordeTarjeta}` }}>
                  EXPLORAR FILTROS
                </Link>
              </div>
              <div style={{ backgroundColor: t.bgMiniBox, padding: '12px', borderRadius: '12px', border: `1px solid ${t.bordeTarjeta}`, textAlign: 'center', minWidth: '95px' }}>
                {/* Dibujo Vectorial de Balanza */}
                <svg width="60" height="50" viewBox="0 0 60 50" fill="none" stroke={t.svgStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                  <path d="M30 8 V38 M18 38 H42 M22 46 H38 M30 18 L15 28 M30 18 L45 28"/>
                  <path d="M12 28 C12 33 18 33 18 28 Z M48 28 C48 33 42 33 42 28 Z"/>
                </svg>
                <span style={{ fontSize: '10px', color: t.textSecundario, display: 'block', marginTop: '4px' }}>Balanza RD</span>
              </div>
            </div>

            {/* Noticia 2 */}
            <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '24px', border: `1px solid ${t.bordeTarjeta}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: t.textPrincipal, margin: '0 0 4px 0' }}>Reporte Semanal de Precios</h4>
                <span style={{ fontSize: '12px', color: t.textSecundario, display: 'block', marginBottom: '10px' }}>28 nov 2026</span>
                <p style={{ fontSize: '13px', color: t.textSecundario, margin: '0 0 10px 0', lineHeight: '1.4' }}>
                  Consulta las variaciones del mercado porcino en las principales provincias y estadísticas.
                </p>
                <div style={{ fontSize: '11px', color: t.textSecundario, marginBottom: '12px', lineHeight: '1.5' }}>
                  <div>Cerdos Kg: <span style={{ color: '#16A34A', fontWeight: '600' }}>↗ Estables</span></div>
                  <div>Lechones Kg: <span style={{ color: '#DC2626', fontWeight: '600' }}>↘ Bajando</span></div>
                </div>
                <Link href="/precios" style={{ backgroundColor: esOscuro ? '#1E293B' : '#F1F5F9', color: t.textPrincipal, padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', border: `1px solid ${t.bordeTarjeta}` }}>
                  VER REPORTE COMPLETO
                </Link>
              </div>
              <div style={{ backgroundColor: t.bgMiniBox, padding: '12px', borderRadius: '12px', border: `1px solid ${t.bordeTarjeta}`, textAlign: 'center', minWidth: '95px' }}>
                {/* Dibujo Vectorial de Gráfico de Tendencia */}
                <svg width="60" height="50" viewBox="0 0 60 50" fill="none" stroke={t.svgStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                  <path d="M10 40 H50 M15 40 V20 M25 40 V12 M35 40 V28 M45 40 V15"/>
                </svg>
                <span style={{ fontSize: '10px', color: t.textSecundario, display: 'block', marginTop: '4px' }}>Tendencia</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}