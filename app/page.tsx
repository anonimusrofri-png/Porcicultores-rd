'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", margin: 0, padding: 0 }}>
      
      {/* Navbar Superior */}
      <header style={{ backgroundColor: '#0B2545', color: '#FFFFFF', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          {/* Nombre en Tipografía Serif elegante */}
          <span style={{ 
            fontWeight: '700', 
            fontSize: '24px', 
            color: '#FFFFFF', 
            letterSpacing: '0.5px', 
            fontFamily: "Georgia, 'Times New Roman', Times, serif",
            textTransform: 'uppercase'
          }}>
            PORCICULTORES-RD
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '14px', fontWeight: '600' }}>
          <Link href="/marketplace" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/directorio" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Directorio</Link>
          <Link href="/precios" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Precios</Link>
          <Link href="/perfil" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Mi Perfil</Link>
        </nav>
      </header>

      {/* Hero Banner Principal */}
      <section style={{ backgroundColor: '#0B2545', color: '#FFFFFF', padding: '60px 20px 90px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '38px', fontWeight: '900', lineHeight: '1.2', margin: '0 0 16px 0' }}>
            Impulsando tu Negocio<br />Porcino Dominicano
          </h1>
          <p style={{ fontSize: '16px', color: '#DCE6F1', maxWidth: '650px', margin: '0 auto 32px auto', lineHeight: '1.5', opacity: 0.9 }}>
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

      {/* Tarjetas Flotantes */}
      <section style={{ maxWidth: '1100px', margin: '-45px auto 40px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <Link href="/marketplace" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>🐷</div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px 0', color: '#0F172A' }}>Marketplace Porcino</h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.4' }}>
                Compra y vende cerdos, lechones y reproductores de forma directa.
              </p>
            </div>
          </Link>

          <Link href="/directorio" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>🏥</div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px 0', color: '#0F172A' }}>Directorio de Servicios</h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.4' }}>
                Veterinarios, agroveterinarias y servicios para el fomento del sector.
              </p>
            </div>
          </Link>

          <Link href="/precios" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>📈</div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px 0', color: '#0F172A' }}>Precios por Provincia</h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.4' }}>
                Precios de referencia por libra/kilo actualizados por provincia.
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* Noticias */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 60px 20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '20px' }}>Novedades y Noticias</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', margin: '0 0 4px 0' }}>Nuevo Filtro por Peso Añadido al Marketplace</h4>
            <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '8px' }}>16 dic 2026</span>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>Guía de Seguridad: Cómo Evitar Estafas en transacciones comerciales.</p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', margin: '0 0 4px 0' }}>Reporte Semanal de Precios</h4>
            <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '8px' }}>28 nov 2026</span>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>Consulta las variaciones del mercado porcino en las principales provincias.</p>
          </div>

        </div>
      </section>

    </div>
  )
}