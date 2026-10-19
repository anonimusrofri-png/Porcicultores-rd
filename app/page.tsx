'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#0B132B', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", margin: 0, padding: 0, color: '#FFFFFF' }}>
      
      {/* Navbar Superior con Tipografía Serif */}
      <header style={{ backgroundColor: '#0B2545', color: '#FFFFFF', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ 
            fontWeight: '700', 
            fontSize: '22px', 
            color: '#FFFFFF', 
            letterSpacing: '0.8px', 
            fontFamily: "Georgia, 'Times New Roman', Times, serif",
            textTransform: 'uppercase'
          }}>
            PORCICULTORES-RD
          </span>
        </Link>

        {/* Menú de Navegación Estilo Pestañas */}
        <nav style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#071022', padding: '6px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" style={{ backgroundColor: '#1C2E4A', color: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🏠 HOME
          </Link>
          <Link href="/marketplace" style={{ color: '#94A3B8', padding: '8px 16px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
            MARKETPLACE
          </Link>
          <Link href="/directorio" style={{ color: '#94A3B8', padding: '8px 16px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
            DIRECTORIO
          </Link>
          <Link href="/precios" style={{ color: '#94A3B8', padding: '8px 16px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
            PRECIOS
          </Link>
        </nav>
      </header>

      {/* Contenedor Principal */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

        {/* 3 Tarjetas Superiores con Efecto de Brillo/Bordes Iluminados */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '50px' }}>
          
          {/* Tarjeta 1: Marketplace (Brillo verde/neón suave) */}
          <Link href="/marketplace" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              backgroundColor: '#111936', 
              borderRadius: '20px', 
              padding: '28px', 
              border: '1px solid rgba(74, 222, 128, 0.4)', 
              boxShadow: '0 0 25px rgba(74, 222, 128, 0.15)',
              height: '100%', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', fontSize: '28px' }}>
                  🐖 🐄 🐖
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: '#F8FAFC' }}>Marketplace Porcino</h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
                  Compra y vende cerdos, lechones y reproductores de forma directa.
                </p>
              </div>
            </div>
          </Link>

          {/* Tarjeta 2: Directorio (Brillo azul/cian suave) */}
          <Link href="/directorio" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              backgroundColor: '#111936', 
              borderRadius: '20px', 
              padding: '28px', 
              border: '1px solid rgba(56, 189, 248, 0.4)', 
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.15)',
              height: '100%', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', fontSize: '28px' }}>
                  🩺 ➕ 🌾
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: '#F8FAFC' }}>Directorio de Servicios</h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
                  Veterinarios, agroveterinarias y servicios para el fomento del sector.
                </p>
              </div>
            </div>
          </Link>

          {/* Tarjeta 3: Precios por Provincia (Brillo morado/rosado suave) */}
          <Link href="/precios" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              backgroundColor: '#111936', 
              borderRadius: '20px', 
              padding: '28px', 
              border: '1px solid rgba(232, 121, 249, 0.4)', 
              boxShadow: '0 0 25px rgba(232, 121, 249, 0.15)',
              height: '100%', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', fontSize: '28px' }}>
                  📊 🗺️ 📈
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: '#F8FAFC' }}>Precios por Provincia</h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
                  Precios de referencia por libra/kilo actualizados por provincia.
                </p>
              </div>
            </div>
          </Link>

        </div>

        {/* Sección de Novedades y Noticias */}
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#F8FAFC', marginBottom: '20px' }}>Novedades y Noticias</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
            
            {/* Noticia 1 */}
            <div style={{ backgroundColor: '#111936', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#F8FAFC', margin: '0 0 4px 0' }}>Nuevo Filtro por Peso Añadido al Marketplace</h4>
                <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '10px' }}>16 dic 2026</span>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                  Guía de Seguridad: Cómo Evitar Estafas en transacciones comerciales. Compro y vención de filtro y preso añadido al marketplace.
                </p>
                <Link href="/marketplace" style={{ backgroundColor: '#1E293B', color: '#E2E8F0', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', border: '1px solid rgba(255,255,255,0.1)' }}>
                  EXPLORAR FILTROS
                </Link>
              </div>
              <div style={{ backgroundColor: '#0B132B', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', minWidth: '100px' }}>
                <div style={{ fontSize: '32px' }}>⚖️</div>
                <span style={{ fontSize: '10px', color: '#64748B', display: 'block', marginTop: '4px' }}>Balanza RD</span>
              </div>
            </div>

            {/* Noticia 2 */}
            <div style={{ backgroundColor: '#111936', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#F8FAFC', margin: '0 0 4px 0' }}>Reporte Semanal de Precios</h4>
                <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '10px' }}>28 nov 2026</span>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  Consulta las variaciones del mercado porcino en las principales provincias y estadísticas.
                </p>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '12px', lineHeight: '1.6' }}>
                  <div>Cerdos Kg: <span style={{ color: '#4ADE80' }}>↗ Estables</span></div>
                  <div>Lechones Kg: <span style={{ color: '#F87171' }}>↘ Bajando</span></div>
                </div>
                <Link href="/precios" style={{ backgroundColor: '#1E293B', color: '#E2E8F0', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', border: '1px solid rgba(255,255,255,0.1)' }}>
                  VER REPORTE COMPLETO
                </Link>
              </div>
              <div style={{ backgroundColor: '#0B132B', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', minWidth: '100px' }}>
                <div style={{ fontSize: '32px' }}>📈</div>
                <span style={{ fontSize: '10px', color: '#64748B', display: 'block', marginTop: '4px' }}>Tendencia</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}