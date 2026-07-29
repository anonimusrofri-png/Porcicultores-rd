'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function NuevaContrasena() {
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const actualizar = async () => {
    if (!password || password !== confirmar) { setError('Las contrase\u00f1as no coinciden'); return }
    if (password.length < 6) { setError('La contrase\u00f1a debe tener al menos 6 caracteres'); return }
    setCargando(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError('Error al actualizar. Intenta de nuevo.') } else { setEnviado(true) }
    setCargando(false)
  }

  if (enviado) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px 24px', maxWidth: '420px', textAlign: 'center', border: '1px solid #E5E7EB', width: '100%' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>\u2705</div>
        <h2 style={{ color: '#1A3C5E', fontWeight: '700', margin: '0 0 10px 0' }}>Contrase\u00f1a actualizada</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>Tu contrase\u00f1a fue actualizada exitosamente.</p>
        <Link href="/login" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Iniciar Sesi\u00f3n</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px 24px', maxWidth: '420px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>\uD83D\uDD11</div>
          <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: '0 0 6px 0' }}>Nueva Contrase\u00f1a</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Ingresa tu nueva contrase\u00f1a</p>
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Nueva Contrase\u00f1a</label>
          <input type="password" placeholder="M\u00ednimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#F9FAFB' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Confirmar Contrase\u00f1a</label>
          <input type="password" placeholder="Repite la contrase\u00f1a" value={confirmar} onChange={(e) => setConfirmar(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && actualizar()}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${confirmar && confirmar !== password ? '#EF4444' : '#E5E7EB'}`, fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#F9FAFB' }} />
          {confirmar && confirmar !== password && <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0 0' }}>Las contrase\u00f1as no coinciden</p>}
        </div>
        {error && <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>\u26A0\uFE0F {error}</div>}
        <button onClick={actualizar} disabled={cargando || !password || password !== confirmar}
          style={{ width: '100%', padding: '14px', background: cargando || !password || password !== confirmar ? '#E5E7EB' : 'linear-gradient(135deg, #1A3C5E, #2563A8)', color: cargando || !password || password !== confirmar ? '#9CA3AF' : 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>
          {cargando ? '\u23F3 Actualizando...' : 'Actualizar Contrase\u00f1a'}
        </button>
        <div style={{ textAlign: 'center' }}>
          <Link href="/login" style={{ color: '#2563A8', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>\u2190 Volver al login</Link>
        </div>
      </div>
    </div>
  )
}
