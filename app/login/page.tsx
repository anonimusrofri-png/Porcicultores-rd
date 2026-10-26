'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [cargando, setCargando] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setCargando(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg('Correo o contraseña incorrectos.')
      setCargando(false)
    } else {
      localStorage.setItem('token_porcicultores', data.session?.access_token || 'activo')
      document.cookie = `token_porcicultores=${data.session?.access_token}; path=/;`
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#0B2545', textAlign: 'center' }}>
        Iniciar Sesión
      </h2>

      {errorMsg && (
        <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', border: '1px solid #FECACA', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>Correo Electrónico</label>
          <input
            type="email"
            placeholder="anonimusrofri@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{ backgroundColor: '#0B2545', color: '#FFFFFF', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', marginTop: '8px' }}
        >
          {cargando ? 'Iniciando sesión...' : 'Entrar'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link href="/" style={{ fontSize: '13px', color: '#64748B', textDecoration: 'none' }}>
          ← Volver al Inicio
        </Link>
      </div>
    </div>
  )
}