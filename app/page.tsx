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

  // Paleta de colores inteligente que varía según el modo elegido por el usuario
  const t = {
    bgPrincipal: esOscuro ? '#0B132B' : '#F1F5F9',
    bgHeader: '#0B2545', // Encabezado azul profesional fijo
    textPrincipal: esOscuro ? '#FFFFFF' : '#0F172A',
    textSecundario: esOscuro ? '#94A3B8' : '#64748B',
    bgTarjeta: esOscuro ? '#111936' : '#FFFFFF',
    bordeTarjeta: esOscuro ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
    textoHeroDesc: '#DCE6F1',
    // Colores de los brillos neón de las 3 tarjetas superiores
    bordeNeonVerde: esOscuro ? 'rgba(74, 222, 128, 0.4)' : '#16A34A',
    sombraNeonVerde: esOscuro ? '0 0 25px rgba(74, 222, 128, 0.15)' : '0 4px 12px rgba(22, 163, 74, 0.15)',
    bordeNeonAzul: esOscuro ? 'rgba(56, 189, 248, 0.4)' : '#0284C7',
    sombraNeonAzul: esOscuro ? '0 0 25px rgba(56, 189, 248, 0.15)' : '0 4px 12px rgba(2, 132, 199, 0.15)',
    bordeNeonMorado: esOscuro ? 'rgba(232, 121, 249, 0.4)' : '#C084FC',
    sombraNeonMorado: esOscuro ? '0 0 25px rgba(232, 121, 249, 0.15)' : '0 4px 12px rgba(192, 132, 252, 0.15)',
    bgMiniBox: esOscuro ? '#0B132B' : '#F8FAFC',
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

          {/* Botón selector de Tema dinámico */}
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

      {/* Contenedor Inferior Estilo Tecnológico Avanzado */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 60px 20px' }}>

        {/* 3 Tarjetas Superiores con Bordes Iluminados y Adaptables */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '45px' }}>
          
          {/* Tarjeta 1 */}
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', fontSize: '26px' }}>
                  🐖 🐄 🐖
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Marketplace Porcino</h3>
                <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>
                  Compra y vende cerdos, lechones y reproductores de forma directa.
                </p>
              </div>
            </div>
          </Link>

          {/* Tarjeta 2 */}
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', fontSize: '26px' }}>
                  🩺 ➕ 🌾
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Directorio de Servicios</h3>
                <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>
                  Veterinarios, agroveterinarias y servicios para el fomento del sector.
                </p>
              </div>
            </div>
          </Link>

          {/* Tarjeta 3 */}
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', fontSize: '26px' }}>
                  📊 🗺️ 📈
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Precios por Provincia</h3>
                <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>
                  Precios de referencia por libra/kilo actualizados por provincia.
                </p>
              </div>
            </div>
          </Link>

        </div>

        {/* Sección de Novedades y Noticias Moderna */}
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
                <div style={{ fontSize: '30px' }}>⚖️</div>
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
                <div style={{ fontSize: '30px' }}>📈</div>
                <span style={{ fontSize: '10px', color: t.textSecundario, display: 'block', marginTop: '4px' }}>Tendencia</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}