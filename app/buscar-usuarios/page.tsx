'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function BuscarUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    setCargando(true)
    const { data } = await supabase.from('perfiles').select('*').order('nombre')
    setUsuarios(data || [])
    setCargando(false)
  }

  const filtrados = usuarios.filter(u => {
    const coincideBusqueda = busqueda === '' || u.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    const coincideTipo = filtroTipo === 'todos' || u.tipo === filtroTipo
    return coincideBusqueda && coincideTipo
  })

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900' }}>Buscar Usuarios</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>

      <input placeholder="Buscar por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        style={{ width: '100%', padding: '14px 16px', marginBottom: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' }} />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['todos', 'comprador', 'vendedor', 'consumidor', 'transportista'].map(t => (
          <button key={t} onClick={() => setFiltroTipo(t)}
            style={{ padding: '8px 18px', borderRadius: '20px', border: '1px solid #e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: filtroTipo === t ? '700' : '500', backgroundColor: filtroTipo === t ? '#0a2463' : 'white', color: filtroTipo === t ? 'white' : '#64748b', fontSize: '13px' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {cargando ? (
        <p style={{ color: '#64748b' }}>Cargando usuarios...</p>
      ) : filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#94a3b8' }}>No se encontraron usuarios</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtrados.map((u) => (
            <div key={u.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0a2463', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', overflow: 'hidden', flexShrink: 0 }}>
                  {u.foto_perfil ? <img src={u.foto_perfil} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.nombre?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: '700', color: '#0a2463', fontSize: '15px', marginBottom: '2px' }}>{u.nombre}</p>
                  <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '2px' }}>{u.tipo} — {u.provincia}</p>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1,2,3,4,5].map(n => (
                      <span key={n} style={{ color: n <= Math.round(u.estrellas || 0) ? '#fbbf24' : '#e2e8f0', fontSize: '12px' }}>★</span>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/chat" style={{ backgroundColor: '#0a2463', color: 'white', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                Contactar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}