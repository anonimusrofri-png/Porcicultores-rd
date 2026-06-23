'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async () => {
    setCargando(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Correo o contrasena incorrectos')
    } else {
      router.push('/')
    }
    setCargando(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` }
    })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Image src="/logo porcicultores rdv.jpeg" alt="Logo" width={80} height={80} style={{ objectFit: 'contain', borderRadius: '12px', marginBottom: '12px' }} />
          <h1 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '900', marginBottom: '4px' }}>Porcicultores RD</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>El Marketplace Porcino de Republica Dominicana</p>
        </div>

        <div style={{ display: 'flex', marginBottom: '24px', backgroundColor: '#f0f4f8', borderRadius: '12px', padding: '4px' }}>
          <Link href="/login" style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '10px', color: '#0a2463', fontWeight: '700', fontSize: '14px', textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            Iniciar Sesion
          </Link>
          <Link href="/registro" style={{ flex: 1, textAlign: 'center', padding: '10px', color: '#64748b', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
            Registrarse
          </Link>
        </div>

        <button onClick={handleGoogleLogin}
          style={{ width: '100%', padding: '12px', backgroundColor: 'white', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          Continuar con Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>o</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        </div>

        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px', color: '#374151' }}>Correo Electronico</label>
        <input type="email" placeholder="ejemplo@correo.do" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />

        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px', color: '#374151' }}>Contrasena</label>
        <input type="password" placeholder="Tu contrasena segura" value={password} onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '8px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

        <div style={{ textAlign: 'right', marginBottom: '16px' }}>
          <Link href="/recuperar" style={{ color: '#0a2463', fontSize: '13px', fontWeight: '600' }}>Olvidaste tu contrasena?</Link>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px', marginBottom: '16px', color: '#dc2626', fontSize: '13px', fontWeight: '600' }}>
            {error}
          </div>
        )}

        <button onClick={handleLogin} disabled={cargando}
          style={{ width: '100%', padding: '14px', backgroundColor: '#0a2463', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>
          {cargando ? 'Entrando...' : 'Ingresar al Panel'}
        </button>

        <div style={{ textAlign: 'center', backgroundColor: '#f0f4f8', borderRadius: '12px', padding: '16px' }}>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>Acceso exclusivo para miembros registrados</p>
          <Link href="/registro" style={{ color: '#0a2463', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>Crear Cuenta Gratis</Link>
        </div>
      </div>
    </div>
  )
}