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

  // Paleta inteligente según el modo elegido por el usuario
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
    svgStroke: esOscuro ? '#E2E8F0' : '#1E293B'
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

      {/* Contenedor Inferior Estilo Referencia */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 60px 20px' }}>

        {/* 3 Tarjetas Superiores */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '45px' }}>
          
          {/* Tarjeta 1: Marketplace Porcino (Ilustración exacta de los cerditos) */}
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
                  <svg width="120" height="48" viewBox="0 0 140 55" fill="none" stroke={t.svgStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {/* Cerdo grande */}
                    <path d="M75 22 C75 12 100 12 105 22 C115 22 122 30 115 40 L105 40 L102 48 L92 48 L92 40 L75 40 L72 48 L62 48 L62 40 C55 30 65 22 75 22 Z"/>
                    <circle cx="108" cy="20" r="1.5" fill={t.svgStroke}/>
                    <path d="M115 25 Q122 26 118 30"/>
                    <path d="M68 40 L65 48"/>
                    <path d="M110 40 L112 48"/>
                    {/* Lechón mediano */}
                    <path d="M35 30 C35 24 50 24 52 30 C58 30 62 36 58 44 L52 44 L50 50 L42 50 L42 44 L32 44 L30 50 L24 50 L24 44 C20 36 28 30 35 30 Z"/>
                    <circle cx="54" cy="28" r="1.2" fill={t.svgStroke}/>
                    {/* Lechón pequeño */}
                    <path d="M10 38 C10 34 20 34 22 38 C25 38 27 42 25 46 L22 46 L20 50 L16 50 L16 46 L10 46 Z"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Marketplace Porcino</h3>
                <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>
                  Compra y vende cerdos, lechones y reproductores de forma directa.
                </p>
              </div>
            </div>
          </Link>

          {/* Tarjeta 2: Directorio de Servicios (Estetoscopio, Cruz médica y trigo exactos) */}
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
                  <svg width="125" height="48" viewBox="0 0 140 55" fill="none" stroke={t.svgStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {/* Estetoscopio */}
                    <path d="M28 10 C15 10 12 22 18 35 C22 41 26 45 26 50 C26 53 22 55 18 53"/>
                    <circle cx="18" cy="53" r="3.5"/>
                    <path d="M28 10 L32 8"/>
                    {/* Cruz */}
                    <path d="M68 15 V38 M56 26 H80" strokeWidth="2.5"/>
                    {/* Espiga de trigo */}
                    <path d="M110 50 V10 M110 20 Q122 15 118 10 M110 28 Q98 23 102 18 M110 38 Q122 33 118 28 M110 45 Q98 40 102 35"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Directorio de Servicios</h3>
                <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>
                  Veterinarios, agroveterinarias y servicios para el fomento del sector.
                </p>
              </div>
            </div>
          </Link>

          {/* Tarjeta 3: Precios por Provincia (Gráfico de barras y Mapa con tendencia exactos) */}
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
                  <svg width="135" height="48" viewBox="0 0 150 55" fill="none" stroke={t.svgStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {/* Gráfico de barras estadísticas */}
                    <path d="M15 45 V30 M27 45 V18 M39 45 V26 M10 45 H45"/>
                    <path d="M18 30 L27 18 L39 26" strokeWidth="1.5" strokeDasharray="2 2"/>
                    {/* Silueta de mapa con flecha de tendencia ascendente */}
                    <path d="M85 38 C90 25 105 20 120 15 C130 20 140 32 135 42 C125 45 100 45 85 38 Z" fill={esOscuro ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}/>
                    <path d="M78 44 L96 32 L110 38 L138 12 M126 12 H138 V24" strokeWidth="2.5"/>
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

        {/* Sección de Novedades y Noticias */}
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
                {/* Ilustración Balanza detallada */}
                <svg width="60" height="45" viewBox="0 0 60 45" fill="none" stroke={t.svgStroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                  <path d="M30 6 V34 M18 34 H42 M24 40 H36 M30 14 L12 22 M30 14 L48 22"/>
                  <path d="M8 22 C8 27 16 27 16 22 Z M52 22 C52 27 44 27 44 22 Z"/>
                  {/* Pequeño cerdo en la balanza */}
                  <path d="M28 20 C28 17 32 17 33 20 C35 20 37 23 35 26 L33 26 Z"/>
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
                {/* Ilustración Gráfico detallado */}
                <svg width="60" height="45" viewBox="0 0 60 45" fill="none" stroke={t.svgStroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                  <path d="M8 38 H52 M12 38 V22 M22 38 V14 M32 38 V26 M42 38 V16"/>
                  <path d="M12 22 L22 14 L32 26 L42 16" strokeWidth="2" strokeDasharray="2 2"/>
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