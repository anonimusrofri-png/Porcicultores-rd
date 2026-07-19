'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Notificaciones() {
  const [notifs, setNotifs] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => { cargarNotifs() }, [])

  const cargarNotifs = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setCargando(false); return }
    const { data } = await supabase.from('publicaciones').select('*').eq('usuario_id', user.id).order('created_at', { ascending: false })
    setNotifs(data || [])
    setCargando(false)
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F6F9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: '0 0 2px 0' }}>\uD83D\uDD14 Notificaciones</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Estado de tus publicaciones</p>
        </div>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>\u2190 Inicio</Link>
      </div>
      {cargando ? (
        <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>Cargando...</p>
      ) : notifs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>\uD83D\uDD14</div>
          <p style={{ color: '#9CA3AF', fontWeight: '600' }}>No tienes notificaciones</p>
          <Link href="/publicar" style={{ display: 'inline-block', marginTop: '12px', backgroundColor: '#1A3C5E', color: 'white', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>Crear publicaci\u00f3n</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifs.map(n => (
            <div key={n.id} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #E5E7EB', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '24px', flexShrink: 0 }}>
                {n.estado === 'aprobada' ? '\u2705' : n.estado === 'rechazada' ? '\u274C' : n.estado === 'vendida' ? '\uD83C\uDF89' : '\u23F3'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '600', color: '#111827', fontSize: '14px', margin: '0 0 4px 0' }}>{n.tipo_animal} \u2014 RD$ {n.precio?.toLocaleString()}</p>
                <p style={{ color: '#6B7280', fontSize: '12px', margin: '0 0 6px 0' }}>\uD83D\uDCCD {n.provincia}</p>
                <span style={{
                  backgroundColor: n.estado === 'aprobada' ? '#D1FAE5' : n.estado === 'rechazada' ? '#FEE2E2' : n.estado === 'vendida' ? '#EDE9FE' : '#FEF3C7',
                  color: n.estado === 'aprobada' ? '#065F46' : n.estado === 'rechazada' ? '#DC2626' : n.estado === 'vendida' ? '#6D28D9' : '#D97706',
                  padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700'
                }}>{n.estado || 'pendiente'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
