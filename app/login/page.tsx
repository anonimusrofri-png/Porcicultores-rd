'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [estaLogueado, setEstaLogueado] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const tokenLocal = localStorage.getItem('token_porcicultores')
      if (session || tokenLocal) {
        setEstaLogueado(true)
      } else {
        setEstaLogueado(false)
      }
      setCargando(false)
    }
    verificarSesion()
  }, [])

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#64748B', fontFamily: 'sans-serif' }}>
        Cargando...
      </div>
    )
  }

  // Si no está logueado, mostrar pantalla de bloqueo
  if (!estaLogueado) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
        <header style={{ backgroundColor: '#0B2545', color: '#FFFFFF', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '700', fontSize: '20px', fontFamily: 'Georgia, serif' }}>
            PORCICULTORES-RD
          </span>
        </header>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '40px 32px', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '460px', width: '100%' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 10px 0', color: '#0F172A', fontFamily: 'Georgia, serif' }}>
              Acceso Exclusivo para Miembros
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 28px 0', lineHeight: '1.6' }}>
              Crea una cuenta gratuita o inicia sesión para ver el marketplace, directorio, precios y reportes del mercado porcino.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link href="/registro" style={{ backgroundColor: '#C81D25', color: '#FFFFFF', padding: '12px 20px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', flex: 1 }}>
                Crear Cuenta
              </Link>
              <Link href="/login" style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '12px 20px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', border: '1px solid #CBD5E1', flex: 1 }}>
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si está logueado, mostrar inicio completo
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* Barra superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '16px 24px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0B2545', margin: 0 }}>
          Porcicultores RD
        </h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/admin" style={{ backgroundColor: '#0B2545', color: '#FFFFFF', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
            Panel Admin
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('token_porcicultores')
              supabase.auth.signOut()
              window.location.reload()
            }}
            style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0B2545', marginBottom: '10px' }}>
          Bienvenido a la plataforma oficial
        </h2>
        <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '0 auto 30px auto' }}>
          Explora el marketplace, consulta los precios actualizados del mercado porcino y conéctate con productores de todo el país.
        </p>

        {/* Tarjetas de acceso rápido (sin caracteres raros) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
          
          <Link href="/marketplace" style={{ padding: '24px', backgroundColor: '#EFF6FF', borderRadius: '16px', textDecoration: 'none', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A8A' }}>Marketplace</div>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Ver animales y publicaciones</div>
          </Link>

          <Link href="/directorio" style={{ padding: '24px', backgroundColor: '#F0FDF4', borderRadius: '16px', textDecoration: 'none', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#166534' }}>Directorio</div>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Contacta productores y granjas</div>
          </Link>

          <Link href="/precios" style={{ padding: '24px', backgroundColor: '#FEF3C7', borderRadius: '16px', textDecoration: 'none', border: '1px solid #FDE68A' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#92400E' }}>Precios</div>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Consulta tarifas por provincia</div>
          </Link>

        </div>
      </div>

    </div>
  )
}