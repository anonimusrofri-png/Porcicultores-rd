'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
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

  const t = {
    bgPrincipal: esOscuro ? '#0B132B' : '#F8FAFC',
    bgHeader: esOscuro ? '#0B2545' : '#FFFFFF',
    textHeader: esOscuro ? '#FFFFFF' : '#0F172A',
    textPrincipal: esOscuro ? '#FFFFFF' : '#0F172A',
    textSecundario: esOscuro ? '#94A3B8' : '#64748B',
    bgTarjeta: esOscuro ? '#111936' : '#FFFFFF',
    bordeTarjeta: esOscuro ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: t.bgPrincipal, fontFamily: "system-ui, -apple-system, sans-serif", margin: 0, padding: 0, color: t.textPrincipal }}>
      
      {/* Encabezado Superior / Navbar */}
      <header style={{ 
        backgroundColor: t.bgHeader, 
        color: t.textHeader, 
        padding: '16px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: `1px solid ${t.bordeTarjeta}`,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/cerdo.png" 
            alt="Logo Porcicultores RD" 
            style={{ width: '36px', height: '36px', objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: '800', fontSize: '20px', color: t.textHeader, fontFamily: "Georgia, serif" }}>
              PORCICULTORES-RD
            </span>
          </Link>
        </div>

        {/* Navegación Superior Limpia */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link 
            href="/terminos" 
            style={{ textDecoration: 'none', color: t.textHeader, fontWeight: '600', fontSize: '14px' }}
          >
            Términos
          </Link>

          <Link 
            href="/terminos/privacidad" 
            style={{ textDecoration: 'none', color: t.textHeader, fontWeight: '600', fontSize: '14px' }}
          >
            Privacidad
          </Link>

          <Link 
            href="/terminos/contacto" 
            style={{ textDecoration: 'none', color: t.textHeader, fontWeight: '600', fontSize: '14px' }}
          >
            Contacto
          </Link>

          <Link 
            href="/perfil" 
            style={{ textDecoration: 'none', color: t.textHeader, fontWeight: '600', fontSize: '14px' }}
          >
            Mi Perfil
          </Link>

          {/* Botón de Modo Oscuro / Claro */}
          <button
            onClick={cambiarTema}
            style={{
              backgroundColor: esOscuro ? 'rgba(255, 255, 255, 0.15)' : '#E2E8F0',
              color: t.textHeader,
              border: 'none',
              padding: '8px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {esOscuro ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: "Georgia, serif", margin: '0 0 12px 0' }}>
            Plataforma del Sector Porcino Dominicano
          </h1>
          <p style={{ color: t.textSecundario, fontSize: '16px', margin: 0 }}>
            Conectando a productores, compradores y servicios agropecuarios en todo el país.
          </p>
        </div>

        {/* Tarjetas de Accesos Directos Principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '28px', border: `1px solid ${t.bordeTarjeta}` }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Marketplace</h3>
            <p style={{ color: t.textSecundario, fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
              Compra y venta de cerdos, lotes de engorde, reproductoras e insumos agropecuarios en Pesos Dominicanos (DOP).
            </p>
            <Link href="/login" style={{ color: '#0284C7', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
              Explorar Ofertas →
            </Link>
          </div>

          <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '28px', border: `1px solid ${t.bordeTarjeta}` }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Directorio</h3>
            <p style={{ color: t.textSecundario, fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
              Encuentra productores verificados, agroveterinarias, transportistas y servicios técnicos en tu provincia.
            </p>
            <Link href="/login" style={{ color: '#0284C7', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
              Ver Directorio →
            </Link>
          </div>

          <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '28px', border: `1px solid ${t.bordeTarjeta}` }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Precios de Referencia</h3>
            <p style={{ color: t.textSecundario, fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
              Consulta actualizaciones periódicas sobre precios por kilo en granja en las diferentes regiones de RD.
            </p>
            <Link href="/login" style={{ color: '#0284C7', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
              Consultar Precios →
            </Link>
          </div>

        </div>
      </main>

    </div>
  )
}