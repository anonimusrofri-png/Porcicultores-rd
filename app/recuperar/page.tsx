'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Recuperar() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const enviar = async () => {
    if (!email) return
    setCargando(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://porcicultores-rd.vercel.app/nueva-contrasena' })
    if (error) { setError('Error al enviar. Verifica el correo.') } else { setEnviado(true) }
    setCargando(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px 24px', maxWidth: '420px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        {enviado ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>\uD83D\uDCE7</div>
            <h2 style={{ color: '#1A3C5E', fontWeight: '700', margin: '0 0 10px 0' }}>Correo enviado</h2>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contrase\u00f1a.</p>
            <Link href="/login" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Volver al Login</Link>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>\uD83D\uDD10</div>
              <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: '0 0 6px 0' }}>Recuperar Contrase\u00f1a</h1>
              <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Ingresa tu correo y te enviaremos un enlace</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Correo electr\u00f3nico</label>
              <input type="email" placeholder="ejemplo@correo.do" value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && enviar()}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#F9FAFB' }} />
            </div>
            {error && <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>\u26A0\uFE0F {error}</div>}
            <button onClick={enviar} disabled={cargando || !email}
              style={{ width: '100%', padding: '14px', background: cargando || !email ? '#E5E7EB' : 'linear-gradient(135deg, #1A3C5E, #2563A8)', color: cargando || !email ? '#9CA3AF' : 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>
              {cargando ? '\u23F3 Enviando...' : 'Enviar enlace de recuperaci\u00f3n'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <Link href="/login" style={{ color: '#2563A8', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>\u2190 Volver al inicio de sesi\u00f3n</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
