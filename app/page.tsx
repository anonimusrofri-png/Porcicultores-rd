'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", margin: 0, padding: 0 }}>
      
      {/* Navbar Superior con Logo Integrado */}
      <header style={{ backgroundColor: '#0B2545', color: '#FFFFFF', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          {/* Logo SVG Nativo */}
          <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <rect width="100" height="100" rx="20" fill="#0B2545"/>
            <path d="M15 35C15 25 25 20 50 20C75 20 85 25 85 35V65C85 75 75 80 50 80C25 80 15 75 15 65V35Z" fill="#134074" stroke="#FFFFFF" strokeWidth="3"/>
            {/* Bandera RD */}
            <path d="M55 25H80V45H55V25Z" fill="#C81D25"/>
            <path d="M55 50H80V70H55V50Z" fill="#0253A3"/>
            <path d="M65 25H70V70H65V25Z" fill="#FFFFFF"/>
            <path d="M55 43H80V47H55V43Z" fill="#FFFFFF"/>
            {/* Cerdo */}
            <circle cx="40" cy="50" r="22" fill="#FFC0CB" stroke="#0B2545" strokeWidth="2.5"/>
            <circle cx="33" cy="45" r="3" fill="#0B2545"/>
            <circle cx="47" cy="45" r="3" fill="#0B2545"/>
            <ellipse cx="40" cy="54" rx="9" ry="6" fill="#FF9999" stroke="#0B2545" strokeWidth="2"/>
            <circle cx="37" cy="54" r="1.5" fill="#0B2545"/>
            <circle cx="43" cy="54" r="1.5" fill="#0B2545"/>
            <path d="M22 34C20 26 28 28 32 32" stroke="#0B2545" strokeWidth="2.5" strokeLinecap="round" fill="#FFC0CB"/>
            <path d="M58 34C60 26 52 28 48 32" stroke="#0B2545" strokeWidth="2.5" strokeLinecap="round" fill="#FFC0CB"/>
          </svg>
          <span style={{ fontWeight: '900', fontSize: '20px', color: '#FFFFFF', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
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