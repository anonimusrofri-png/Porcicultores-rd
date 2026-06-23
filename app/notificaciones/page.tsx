'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarNotificaciones()
  }, [])

  const cargarNotificaciones = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setCargando(false); return }
    const { data } = await supabase
      .from('publicaciones')
      .select('*')
      .eq('usuario_id', user.id)
      .neq('estado', 'pendiente')
      .order('created_at', { ascending: false })
    setNotificaciones(data || [])
    setCargando(false)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900' }}>Notificaciones</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>

      {cargando ? (
        <p style={{ color: '#64748b' }}>Cargando...</p>
      ) : notificaciones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#94a3b8' }}>No tienes notificaciones</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notificaciones.map((n) => (
            <div key={n.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '700', color: '#0a2463' }}>
                  Tu publicacion de {n.tipo_animal} fue {n.estado === 'aprobada' ? 'aprobada' : 'rechazada'}
                </p>
                <p style={{ color: '#64748b', fontSize: '13px' }}>RD$ {n.precio?.toLocaleString()} — {n.provincia}</p>
              </div>
              <span style={{ backgroundColor: n.estado === 'aprobada' ? '#dcfce7' : '#fee2e2', color: n.estado === 'aprobada' ? '#16a34a' : '#dc2626', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                {n.estado}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}