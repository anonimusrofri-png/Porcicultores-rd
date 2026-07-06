'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Transportistas() {
  const [transportistas, setTransportistas] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const { data } = await supabase.from('directorio').select('*').eq('categoria', 'transportista').order('nombre')
    setTransportistas(data || [])
    setCargando(false)
  }

  const filtrados = transportistas.filter(t =>
    busqueda === '' || t.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || t.provincia?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900' }}>Transportistas</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>

      <input placeholder="Buscar por provincia o nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        style={{ width: '100%', padding: '14px 16px', marginBottom: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' }} />

      <div style={{ backgroundColor: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#0369a1' }}>
        Transportistas con protocolos de bioseguridad para el manejo de porcinos.
      </div>

      {cargando ? (
        <p style={{ color: '#64748b' }}>Cargando...</p>
      ) : filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#94a3b8' }}>No hay transportistas disponibles</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtrados.map((t) => (
            <div key={t.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ color: '#0a2463', fontWeight: '800', fontSize: '17px' }}>{t.nombre}</h3>
                {t.verificado && <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Verificado</span>}
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>{t.provincia}</p>
              {t.descripcion && <p style={{ color: '#475569', fontSize: '14px', marginBottom: '12px', lineHeight: 1.6 }}>{t.descripcion}</p>}
              <div style={{ display: 'flex', gap: '8px' }}>
                {t.whatsapp && (
                  <a href={`https://wa.me/1${t.whatsapp.replace(/\D/g,'')}`} target="_blank"
                    style={{ backgroundColor: '#25d366', color: 'white', padding: '10px 16px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                    WhatsApp
                  </a>
                )}
                <Link href="/chat" style={{ backgroundColor: '#0a2463', color: 'white', padding: '10px 16px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                  Chat Privado
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}