'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default function Recuperar() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleRecuperar = async () => {
    if (!email) {
      setError('Por favor ingresa tu correo electronico')
      return
    }
    setCargando(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/nueva-contrasena` : undefined,
    })
    if (error) {
      setError('Error al enviar el correo. Intenta de nuevo.')
    } else {
      setEnviado(true)
    }
    setCargando(false)
  }

  if (enviado) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#16a34a', marginBottom: '12px', fontWeight: '800' }}>Correo enviado</h2>
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px', lineHeight: 1.6 }}>Revisa tu correo electronico y sigue las instrucciones para restablecer tu contrasena.</p>
        <Link href="/login" style={{ color: '#0a2463', fontWeight: '700', fontSize: '14px' }}>Volver a Iniciar Sesion</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Image src="/logo porcicultores rdv.jpeg" alt="Logo" width={70} height={70} style={{ objectFit: 'contain', borderRadius: '12px', marginBottom: '12px' }} />
          <h1 style={{ color: '#0a2463', fontSize: '20px', fontWeight: '900', marginBottom: '4px' }}>Recuperar Contrasena</h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Te enviaremos un enlace para restablecerla</p>
        </div>

        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px', color: '#374151' }}>Correo Electronico</label>
        <input type="email" placeholder="ejemplo@correo.do" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <button onClick={handleRecuperar} disabled={cargando}
          style={{ width: '100%', padding: '14px', backgroundColor: '#0a2463', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>
          {cargando ? 'Enviando...' : 'Enviar Enlace de Recuperacion'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <Link href="/login" style={{ color: '#64748b', fontSize: '13px' }}>Volver a Iniciar Sesion</Link>
        </div>
      </div>
    </div>
  )
}