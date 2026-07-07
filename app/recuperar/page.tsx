'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => { cargarNotificaciones() }, [])

  const cargarNotificaciones = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setCargando(false); return }
    const { data } = await supabase.from('publicaciones').select('*').eq('usuario_id', user.id).neq('estado', 'pendiente').order('created_at', { ascending: false })
    setNotificaciones(data || [])
    setCargando(false)
  }

  const getInfo = (estado: string) => {
    if (estado === 'aprobada') return { bg: '#dcfce7', color: '#16a34a', texto: 'Tu publicacion fue APROBADA y ya es visible en el marketplace.' }
    if (estado === 'rechazada') return { bg: '#fee2e2', color: '#dc2626', texto: 'Tu publicacion fue RECHAZADA por el administrador.' }
    if (estado === 'vendida') return { bg: '#e0e7ff', color: '#4338ca', texto: 'Tu publicacion fue marcada como VENDIDA.' }
    return { bg: '#f1f5f9', color: '#64748b', texto: 'Tu publicacion fue actualizada.' }
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900' }}>Notificaciones</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>
      {cargando ? <p style={{ color: '#64748b' }}>Cargando...</p> : notificaciones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No tienes notificaciones</p>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Aqui apareceran las actualizaciones de tus publicaciones</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notificaciones.map((n) => {
            const { bg, color, texto } = getInfo(n.estado)
            return (
              <div key={n.id} style={{ backgroundColor: bg, borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ backgroundColor: color, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{n.estado.toUpperCase()}</span>
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>{n.created_at?.slice(0, 10)}</span>
                </div>
                <p style={{ color: '#1e293b', fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{texto}</p>
                <p style={{ color: '#475569', fontSize: '13px', marginBottom: '4px' }}>{n.tipo_animal} — RD$ {n.precio?.toLocaleString()} — {n.provincia}</p>
                {n.estado === 'aprobada' && (
                  <Link href="/marketplace" style={{ display: 'inline-block', marginTop: '12px', backgroundColor: '#0a2463', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>Ver en Marketplace</Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}