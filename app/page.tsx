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
        Cargando plataforma...
      </div>
    )
  }

  if (!estaLogueado) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "system-ui, -apple-system, sans-serif", display: 'flex', flexDirection: 'column' }}>
        <header style={{ backgroundColor: '#0B2545', color: '#FFFFFF', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '700', fontSize: '20px', fontFamily: "Georgia, serif" }}>
            PORCICULTORES-RD
          </span>
        </header>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '40px 32px', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '460px', width: '100%' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 10px 0', color: '#0F172A', fontFamily: "Georgia, serif" }}>
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

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Bienvenido a Porcicultores RD</h1>
      <p>Has iniciado sesión correctamente.</p>
      <Link href="/admin" style={{ color: '#0B2545', fontWeight: 'bold' }}>Ir al Panel de Administración</Link>
    </div>
  )
}