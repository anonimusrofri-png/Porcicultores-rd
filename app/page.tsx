'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [esOscuro, setEsOscuro] = useState(true) // Por defecto arranca en oscuro como en tu referencia

  // Sincronizar con la preferencia del usuario guardada previamente
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

  // Definición de colores dinámicos según el modo elegido
  const t = {
    bgPrincipal: esOscuro ? '#0B132B' : '#F8FAFC',
    bgHeader: esOscuro ? '#0B2545' : '#FFFFFF',
    textPrincipal: esOscuro ? '#FFFFFF' : '#0F172A',
    textSecundario: esOscuro ? '#94A3B8' : '#64748B',
    bgTarjeta: esOscuro ? '#111936' : '#FFFFFF',
    bordeTarjeta: esOscuro ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
    navBg: esOscuro ? '#071022' : '#F1F5F9',
    navTexto: esOscuro ? '#94A3B8' : '#475569',
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: t.bgPrincipal, fontFamily: "system-ui, -apple-system, sans-serif", margin: 0, padding: 0, color: t.textPrincipal, transition: 'background-color 0.3s ease' }}>
      
      {/* Navbar Superior */}
      <header style={{ backgroundColor: t.bgHeader, color: t.textPrincipal, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${t.bordeTarjeta}` }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ 
            fontWeight: '700', 
            fontSize: '22px', 
            color: t.textPrincipal, 
            letterSpacing: '0.8px', 
            fontFamily: "Georgia, 'Times New Roman', Times, serif",
            textTransform: 'uppercase'
          }}>
            PORCICULTORES-RD
          </span>
        </Link>

        {/* Menú y Botón de Modo Oscuro / Claro */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: t.navBg, padding: '6px 10px', borderRadius: '12px', border: `1px solid ${t.bordeTarjeta}` }}>
            <Link href="/" style={{ backgroundColor: esOscuro ? '#1C2E4A' : '#FFFFFF', color: t.textPrincipal, padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
              HOME
            </Link>
            <Link href="/marketplace" style={{ color: t.navTexto, padding: '8px 16px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
              MARKETPLACE
            </Link>
            <Link href="/directorio" style={{ color: t.navTexto, padding: '8px 16px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
              DIRECTORIO
            </Link>
            <Link href="/precios" style={{ color: t.navTexto, padding: '8px 16px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
              PRECIOS
            </Link>
          </nav>

          {/* Botón Alternar Tema */}
          <button
            onClick={cambiarTema}
            style={{
              backgroundColor: esOscuro ? '#1E293B' : '#E2E8F0',
              color: t.textPrincipal,
              border: `1px solid ${t.bordeTarjeta}`,
              padding: '10px 14px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
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

      {/* Contenedor Principal */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

        {/* 3 Tarjetas Superiores */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '50px' }}>
          
          <Link href="/marketplace" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '28px', border: '1px solid rgba(74, 222, 128, 0.4)', boxShadow: '0 0 20px rgba(74, 222, 128, 0.1)', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', fontSize: '28px' }}>🐖 🐄 🐖</div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Marketplace Porcino</h3>
              <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>Compra y vende cerdos, lechones y reproductores de forma directa.</p>
            </div>
          </Link>

          <Link href="/directorio" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '28px', border: '1px solid rgba(56, 189, 248, 0.4)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.1)', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', fontSize: '28px' }}>🩺 ➕ 🌾</div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Directorio de Servicios</h3>
              <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>Veterinarios, agroveterinarias y servicios para el fomento del sector.</p>
            </div>
          </Link>

          <Link href="/precios" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '28px', border: '1px solid rgba(232, 121, 249, 0.4)', boxShadow: '0 0 20px rgba(232, 121, 249, 0.1)', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', fontSize: '28px' }}>📊 🗺️ 📈</div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Precios por Provincia</h3>
              <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>Precios de referencia por libra/kilo actualizados por provincia.</p>
            </div>
          </Link>

        </div>

        {/* Sección de Noticias */}
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: t.textPrincipal, marginBottom: '20px' }}>Novedades y Noticias</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
            
            <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '24px', border: `1px solid ${t.bordeTarjeta}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: t.textPrincipal, margin: '0 0 4px 0' }}>Nuevo Filtro por Peso Añadido al Marketplace</h4>
                <span style={{ fontSize: '12px', color: t.textSecundario, display: 'block', marginBottom: '10px' }}>16 dic 2026</span>
                <p style={{ fontSize: '13px', color: t.textSecundario, margin: '0 0 16px 0', lineHeight: '1.4' }}>Guía de Seguridad: Cómo Evitar Estafas en transacciones comerciales.</p>
                <Link href="/marketplace" style={{ backgroundColor: esOscuro ? '#1E293B' : '#E2E8F0', color: t.textPrincipal, padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-block' }}>
                  EXPLORAR FILTROS
                </Link>
              </div>
              <div style={{ backgroundColor: esOscuro ? '#0B132B' : '#F1F5F9', padding: '12px', borderRadius: '12px', textAlign: 'center', minWidth: '90px' }}>
                <div style={{ fontSize: '28px' }}>⚖️</div>
              </div>
            </div>

            <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '24px', border: `1px solid ${t.bordeTarjeta}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: t.textPrincipal, margin: '0 0 4px 0' }}>Reporte Semanal de Precios</h4>
                <span style={{ fontSize: '12px', color: t.textSecundario, display: 'block', marginBottom: '10px' }}>28 nov 2026</span>
                <p style={{ fontSize: '13px', color: t.textSecundario, margin: '0 0 14px 0', lineHeight: '1.4' }}>Consulta las variaciones del mercado porcino en las provincias.</p>
                <Link href="/precios" style={{ backgroundColor: esOscuro ? '#1E293B' : '#E2E8F0', color: t.textPrincipal, padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-block' }}>
                  VER REPORTE COMPLETO
                </Link>
              </div>
              <div style={{ backgroundColor: esOscuro ? '#0B132B' : '#F1F5F9', padding: '12px', borderRadius: '12px', textAlign: 'center', minWidth: '90px' }}>
                <div style={{ fontSize: '28px' }}>📈</div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}