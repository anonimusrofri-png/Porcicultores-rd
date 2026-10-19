'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", margin: 0, padding: 0 }}>
      
      {/* Navbar Superior Original */}
      <header style={{ backgroundColor: '#0B2545', color: '#FFFFFF', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#FFFFFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            🐷
          </div>
          <span style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '0.5px' }}>
            PORCICULTORES RD
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '14px', fontWeight: '600' }}>
          <Link href="/marketplace" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/directorio" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Directorio</Link>
          <Link href="/precios" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Precios</Link>
          <Link href="/perfil" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Mi Perfil</Link>
        </nav>
      </header>

      {/* Hero Banner Principal (El que querías conservar arriba) */}
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

      {/* 3 Tarjetas Superiores Flotantes (Estilo original de arriba) */}
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

      {/* Sección Inferior Actualizada (Noticias con el nuevo diseño que te gustó) */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 60px 20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '20px' }}>Novedades y Noticias</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px' }}>
          
          {/* Noticia 1 */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', margin: '0 0 4px 0' }}>Nuevo Filtro por Peso Añadido al Marketplace</h4>
              <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '8px' }}>16 dic 2026</span>
              <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                Guía de Seguridad: Cómo Evitar Estafas en transacciones comerciales. Compro y vención de filtro y preso añadido al marketplace.
              </p>
              <Link href="/marketplace" style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', border: '1px solid #E2E8F0' }}>
                EXPLORAR FILTROS
              </Link>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', minWidth: '90px' }}>
              <div style={{ fontSize: '28px' }}>⚖️</div>
              <span style={{ fontSize: '10px', color: '#64748B', display: 'block', marginTop: '4px' }}>Balanza RD</span>
            </div>
          </div>

          {/* Noticia 2 */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', margin: '0 0 4px 0' }}>Reporte Semanal de Precios</h4>
              <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '8px' }}>28 nov 2026</span>
              <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                Consulta las variaciones del mercado porcino en las principales provincias y estadísticas.
              </p>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '12px', lineHeight: '1.5' }}>
                <div>Cerdos Kg: <span style={{ color: '#16A34A', fontWeight: '600' }}>↗ Estables</span></div>
                <div>Lechones Kg: <span style={{ color: '#DC2626', fontWeight: '600' }}>↘ Bajando</span></div>
              </div>
              <Link href="/precios" style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', border: '1px solid #E2E8F0' }}>
                VER REPORTE COMPLETO
              </Link>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', minWidth: '90px' }}>
              <div style={{ fontSize: '28px' }}>📈</div>
              <span style={{ fontSize: '10px', color: '#64748B', display: 'block', marginTop: '4px' }}>Tendencia</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}