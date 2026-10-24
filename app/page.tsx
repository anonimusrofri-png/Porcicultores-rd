'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [esOscuro, setEsOscuro] = useState(true)
  const [estaLogueado, setEstaLogueado] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const temaGuardado = localStorage.getItem('tema_porcicultores')
    if (temaGuardado) {
      setEsOscuro(temaGuardado === 'oscuro')
    }

    const token = localStorage.getItem('token_porcicultores')
    if (token) {
      setEstaLogueado(true)
    }
    setCargando(false)
  }, [])

  const cambiarTema = () => {
    const nuevoTema = !esOscuro
    setEsOscuro(nuevoTema)
    localStorage.setItem('tema_porcicultores', nuevoTema ? 'oscuro' : 'claro')
  }

  const t = {
    bgPrincipal: esOscuro ? '#0B132B' : '#F8FAFC',
    bgHeaderYBanner: esOscuro ? '#0B2545' : '#FFFFFF',
    textHeaderYBanner: esOscuro ? '#FFFFFF' : '#0F172A',
    textSubHero: esOscuro ? '#DCE6F1' : '#475569',
    textPrincipal: esOscuro ? '#FFFFFF' : '#0F172A',
    textSecundario: esOscuro ? '#94A3B8' : '#64748B',
    bgTarjeta: esOscuro ? '#111936' : '#FFFFFF',
    bordeTarjeta: esOscuro ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
    bordeNeonVerde: esOscuro ? 'rgba(74, 222, 128, 0.4)' : '#16A34A',
    sombraNeonVerde: esOscuro ? '0 0 25px rgba(74, 222, 128, 0.15)' : '0 4px 12px rgba(22, 163, 74, 0.15)',
    bordeNeonAzul: esOscuro ? 'rgba(56, 189, 248, 0.4)' : '#0284C7',
    sombraNeonAzul: esOscuro ? '0 0 25px rgba(56, 189, 248, 0.15)' : '0 4px 12px rgba(2, 132, 199, 0.15)',
    bordeNeonMorado: esOscuro ? 'rgba(232, 121, 249, 0.4)' : '#C084FC',
    sombraNeonMorado: esOscuro ? '0 0 25px rgba(232, 121, 249, 0.15)' : '0 4px 12px rgba(192, 132, 252, 0.15)',
    btnBotonSecundarioBg: esOscuro ? 'rgba(255, 255, 255, 0.12)' : '#F1F5F9',
    btnBotonSecundarioBorder: esOscuro ? 'rgba(255,255,255,0.3)' : '#CBD5E1',
    btnBotonSecundarioText: esOscuro ? '#FFFFFF' : '#0F172A',
  }

  if (cargando) {
    return null
  }

  if (!estaLogueado) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: t.bgPrincipal, fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", margin: 0, padding: 0, color: t.textPrincipal, transition: 'background-color 0.3s ease', display: 'flex', flexDirection: 'column' }}>
        <header style={{ backgroundColor: t.bgHeaderYBanner, color: t.textHeaderYBanner, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderBottom: `1px solid ${t.bordeTarjeta}` }}>
          <span style={{ fontWeight: '700', fontSize: '22px', color: t.textHeaderYBanner, letterSpacing: '0.8px', fontFamily: "Georgia, 'Times New Roman', Times, serif", textTransform: 'uppercase' }}>
            PORCICULTORES-RD
          </span>
          <button
            onClick={cambiarTema}
            style={{
              backgroundColor: esOscuro ? 'rgba(255, 255, 255, 0.15)' : '#E2E8F0',
              color: t.textHeaderYBanner,
              border: `1px solid ${esOscuro ? 'rgba(255, 255, 255, 0.3)' : '#CBD5E1'}`,
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
        </header>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ 
            backgroundColor: t.bgTarjeta, 
            padding: '40px 32px', 
            borderRadius: '24px', 
            border: `1px solid ${t.bordeTarjeta}`, 
            boxShadow: esOscuro ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.08)',
            textAlign: 'center',
            maxWidth: '460px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 10px 0', color: t.textPrincipal, fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
              Acceso Exclusivo para Miembros
            </h2>
            <p style={{ fontSize: '14px', color: t.textSecundario, margin: '0 0 28px 0', lineHeight: '1.6' }}>
              Crea una cuenta gratuita o inicia sesión para ver el marketplace, directorio, precios y reportes del mercado porcino.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
              <Link 
                href="/registro" 
                style={{ backgroundColor: '#C81D25', color: '#FFFFFF', padding: '12px 20px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', flex: 1 }}
              >
                Crear Cuenta
              </Link>
              <Link 
                href="/login" 
                style={{ backgroundColor: esOscuro ? '#1E293B' : '#F1F5F9', color: t.textPrincipal, padding: '12px 20px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', border: `1px solid ${t.bordeTarjeta}`, flex: 1 }}
              >
                Iniciar Sesión
              </Link>
            </div>
            <button
              onClick={() => {
                localStorage.setItem('token_porcicultores', 'activo_demo')
                setEstaLogueado(true)
              }}
              style={{ background: 'none', border: 'none', color: t.textSecundario, fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              [Modo Demo: Simular inicio de sesión]
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: t.bgPrincipal, fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", margin: 0, padding: 0, color: t.textPrincipal, transition: 'background-color 0.3s ease' }}>
      <header style={{ backgroundColor: t.bgHeaderYBanner, color: t.textHeaderYBanner, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderBottom: `1px solid ${t.bordeTarjeta}`, transition: 'all 0.3s ease' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ 
            fontWeight: '700', 
            fontSize: '22px', 
            color: t.textHeaderYBanner, 
            letterSpacing: '0.8px', 
            fontFamily: "Georgia, 'Times New Roman', Times, serif",
            textTransform: 'uppercase'
          }}>
            PORCICULTORES-RD
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <nav style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '14px', fontWeight: '600' }}>
            <Link href="/terminos" style={{ color: t.textHeaderYBanner, textDecoration: 'none', opacity: 0.9 }}>Términos</Link>
            <Link href="/terminos/privacidad" style={{ color: t.textHeaderYBanner, textDecoration: 'none', opacity: 0.9 }}>Privacidad</Link>
            <Link href="/terminos/contacto" style={{ color: t.textHeaderYBanner, textDecoration: 'none', opacity: 0.9 }}>Contacto</Link>
            <Link href="/perfil" style={{ color: t.textHeaderYBanner, textDecoration: 'none', opacity: 0.9 }}>Mi Perfil</Link>
          </nav>

          <button
            onClick={cambiarTema}
            style={{
              backgroundColor: esOscuro ? 'rgba(255, 255, 255, 0.15)' : '#E2E8F0',
              color: t.textHeaderYBanner,
              border: `1px solid ${esOscuro ? 'rgba(255, 255, 255, 0.3)' : '#CBD5E1'}`,
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

      <section style={{ backgroundColor: t.bgHeaderYBanner, color: t.textHeaderYBanner, padding: '60px 20px 70px 20px', textAlign: 'center', borderBottom: `1px solid ${t.bordeTarjeta}`, transition: 'all 0.3s ease' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '38px', fontWeight: '900', lineHeight: '1.2', margin: '0 0 16px 0', color: t.textHeaderYBanner }}>
            Impulsando tu Negocio<br />Porcino Dominicano
          </h1>
          <p style={{ fontSize: '16px', color: t.textSubHero, maxWidth: '650px', margin: '0 auto 32px auto', lineHeight: '1.5' }}>
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
              style={{ backgroundColor: t.btnBotonSecundarioBg, color: t.btnBotonSecundarioText, fontWeight: '600', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', border: `1px solid ${t.btnBotonSecundarioBorder}` }}
            >
              Consultar Precios por Provincia
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 60px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '45px' }}>
          <Link href="/marketplace" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '28px', border: `1px solid ${t.bordeNeonVerde}`, boxShadow: t.sombraNeonVerde, height: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Marketplace Porcino</h3>
              <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>Compra y vende cerdos, lechones y reproductores de forma directa.</p>
            </div>
          </Link>

          <Link href="/directorio" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '28px', border: `1px solid ${t.bordeNeonAzul}`, boxShadow: t.sombraNeonAzul, height: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Directorio de Servicios</h3>
              <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>Veterinarios, agroveterinarias y servicios para el fomento del sector.</p>
            </div>
          </Link>

          <Link href="/precios" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '28px', border: `1px solid ${t.bordeNeonMorado}`, boxShadow: t.sombraNeonMorado, height: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: t.textPrincipal }}>Precios por Provincia</h3>
              <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>Precios de referencia por libra/kilo actualizados por provincia.</p>
            </div>
          </Link>
        </div>

        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: t.textPrincipal, marginBottom: '20px' }}>Novedades y Noticias</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '24px', border: `1px solid ${t.bordeTarjeta}` }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: t.textPrincipal, margin: '0 0 4px 0' }}>Nuevo Filtro por Peso Añadido al Marketplace</h4>
              <span style={{ fontSize: '12px', color: t.textSecundario, display: 'block', marginBottom: '10px' }}>16 dic 2026</span>
              <p style={{ fontSize: '13px', color: t.textSecundario, margin: '0 0 16px 0', lineHeight: '1.4' }}>Guía de Seguridad: Cómo Evitar Estafas en transacciones comerciales.</p>
              <Link href="/marketplace" style={{ backgroundColor: esOscuro ? '#1E293B' : '#F1F5F9', color: t.textPrincipal, padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', border: `1px solid ${t.bordeTarjeta}` }}>EXPLORAR FILTROS</Link>
            </div>

            <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '20px', padding: '24px', border: `1px solid ${t.bordeTarjeta}` }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: t.textPrincipal, margin: '0 0 4px 0' }}>Reporte Semanal de Precios</h4>
              <span style={{ fontSize: '12px', color: t.textSecundario, display: 'block', marginBottom: '10px' }}>28 nov 2026</span>
              <p style={{ fontSize: '13px', color: t.textSecundario, margin: '0 0 10px 0', lineHeight: '1.4' }}>Consulta las variaciones del mercado porcino en las principales provincias.</p>
              <div style={{ fontSize: '11px', color: t.textSecundario, marginBottom: '12px', lineHeight: '1.5' }}>
                <div>Cerdos Kg: <span style={{ color: '#16A34A', fontWeight: '600' }}>↗ Estables</span></div>
                <div>Lechones Kg: <span style={{ color: '#DC2626', fontWeight: '600' }}>↘ Bajando</span></div>
              </div>
              <Link href="/precios" style={{ backgroundColor: esOscuro ? '#2a7afc' : '#F1F5F9', color: t.textPrincipal, padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', border: `1px solid ${t.bordeTarjeta}` }}>VER REPORTE COMPLETO</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}