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
    if (error) { setError('Correo o contraseña incorrectos') } else { router.push('/') }
    setCargando(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/' } })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'linear-gradient(135deg, #1A3C5E 0%, #2563A8 100%)', borderRadius: '20px 20px 0 0', padding: '32px 24px', textAlign: 'center' }}>
        <Image src="/logo porcicultores rdv.jpeg" alt="Logo" width={64} height={64} style={{ objectFit: 'contain', borderRadius: '12px', marginBottom: '12px' }} />
        <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0' }}>Porcicultores RD</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', margin: 0 }}>El Marketplace Porcino de República Dominicana</p>
      </div>
      <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '440px', borderRadius: '0 0 20px 20px', padding: '28px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        <div style={{ display: 'flex', backgroundColor: '#F4F6F9', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#1A3C5E', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '14px' }}>
            Iniciar Sesión
          </div>
          <Link href="/registro" style={{ flex: 1, textAlign: 'center', padding: '10px', color: '#6B7280', fontWeight: '600', fontSize: '14px', textDecoration: 'none', borderRadius: '10px' }}>
            Registrarse
          </Link>
        </div>
        <button onClick={handleGoogle}
          style={{ width: '100%', padding: '12px', backgroundColor: 'white', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>G</span> Continuar con Google
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
          <span style={{ color: '#9CA3AF', fontSize: '12px' }}>o</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Correo Electrónico</label>
          <input type="email" placeholder="ejemplo@correo.do" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#F9FAFB' }} />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Contraseña</label>
          <input type="password" placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#F9FAFB' }} />
        </div>
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Link href="/recuperar" style={{ color: '#2563A8', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</Link>
        </div>
        {error && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}
        <button onClick={handleLogin} disabled={cargando}
          style={{ width: '100%', padding: '14px', background: cargando ? '#93C5FD' : 'linear-gradient(135deg, #1A3C5E, #2563A8)', color: 'white', border: 'none', borderRadius: '10px', cursor: cargando ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>
          {cargando ? '⏳ Entrando...' : 'Iniciar Sesión'}
        </button>
        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 8px 0' }}>¿No tienes cuenta?</p>
          <Link href="/registro" style={{ color: '#1A3C5E', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>Crear Cuenta Gratis →</Link>
        </div>
      </div>
    </div>
  )
}