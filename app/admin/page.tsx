'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Admin() {
  const [pendientes, setPendientes] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [procesandoId, setProcesandoId] = useState<string | null>(null)
  const [filtroTab, setFiltroTab] = useState<'pendiente' | 'rechazado'>('pendiente')

  useEffect(() => {
    cargarPublicaciones()
  }, [filtroTab])

  const cargarPublicaciones = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('publicaciones')
      .select('*, perfiles:usuario_id(nombre, telefono)')
      .eq('estado', filtroTab)
      .order('created_at', { ascending: false })

    if (!error) {
      setPendientes(data || [])
    }
    setCargando(false)
  }

  const handleAprobar = async (id: string) => {
    setProcesandoId(id)
    const { error } = await supabase
      .from('publicaciones')
      .update({ activo: true, estado: 'aprobado' })
      .eq('id', id)

    if (!error) {
      setPendientes(prev => prev.filter(p => p.id !== id))
    } else {
      alert('Error al aprobar la publicación')
    }
    setProcesandoId(null)
  }

  const handleRechazar = async (id: string) => {
    if (!confirm('¿Estás seguro de rechazar esta publicación?')) return

    setProcesandoId(id)
    const { error } = await supabase
      .from('publicaciones')
      .update({ activo: false, estado: 'rechazado' })
      .eq('id', id)

    if (!error) {
      setPendientes(prev => prev.filter(p => p.id !== id))
    } else {
      alert('Error al rechazar la publicación')
    }
    setProcesandoId(null)
  }

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', fontFamily: "'Inter', sans-serif", backgroundColor: '#FFFFFF', minHeight: '100vh', boxShadow: '0 0 20px rgba(0,0,0,0.05)', paddingBottom: '40px' }}>

      {/* Encabezado Principal */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#1E293B', margin: 0 }}>Panel de Moderación</h1>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>Administración de anuncios</p>
        </div>
        <Link href="/" style={{ color: '#0253A3', textDecoration: 'none', fontSize: '13px', fontWeight: '600', backgroundColor: '#EFF6FF', padding: '6px 12px', borderRadius: '20px' }}>
          ← Inicio
        </Link>
      </div>

      <div style={{ padding: '16px 20px' }}>

        {/* Pestañas de Navegación del Panel */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#F8FAFC', padding: '4px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
          <button
            onClick={() => setFiltroTab('pendiente')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: filtroTab === 'pendiente' ? '#FFFFFF' : 'transparent',
              color: filtroTab === 'pendiente' ? '#0253A3' : '#64748B',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: filtroTab === 'pendiente' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}>
            ⏳ Pendientes
          </button>
          <button
            onClick={() => setFiltroTab('rechazado')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: filtroTab === 'rechazado' ? '#FFFFFF' : 'transparent',
              color: filtroTab === 'rechazado' ? '#DC2626' : '#64748B',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: filtroTab === 'rechazado' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}>
            ✕ Rechazados
          </button>
        </div>

        {/* Lista de Publicaciones en Moderación */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B', fontSize: '14px' }}>
            Cargando solicitudes...
          </div>
        ) : pendientes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎉</div>
            <p style={{ fontSize: '14px', margin: 0, fontWeight: '600', color: '#475569' }}>
              No hay publicaciones {filtroTab === 'pendiente' ? 'pendientes de revisión' : 'rechazadas'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendientes.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                
                {/* Imagen */}
                <div style={{ width: '100%', height: '180px', backgroundColor: '#F1F5F9', position: 'relative' }}>
                  {item.foto_url ? (
                    <img src={item.foto_url} alt={item.tipo_animal} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                      🐷
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
                    📍 {item.provincia}
                  </div>
                </div>

                {/* Contenido */}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#0253A3' }}>
                      {item.tipo_animal}
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#1E293B' }}>
                      RD$ {item.precio ? Number(item.precio).toLocaleString('es-DO') : '0'}
                    </span>
                  </div>

                  {item.peso && (
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                      ⚖️ Peso: <strong style={{ color: '#334155' }}>{item.peso} lbs</strong>
                    </div>
                  )}

                  <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                    {item.descripcion}
                  </p>

                  {/* Datos del Vendedor */}
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', fontSize: '12px', color: '#475569' }}>
                    <div>👤 Vendedor: <strong style={{ color: '#1E293B' }}>{item.perfiles?.nombre || 'Desconocido'}</strong></div>
                    <div>📞 Contacto: <strong style={{ color: '#1E293B' }}>{item.perfiles?.telefono || 'No especificado'}</strong></div>
                  </div>

                  {/* Botones de Acción */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {filtroTab === 'pendiente' && (
                      <button
                        onClick={() => handleAprobar(item.id)}
                        disabled={procesandoId === item.id}
                        style={{ flex: 1, backgroundColor: '#10B981', color: 'white', border: 'none', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                        {procesandoId === item.id ? '...' : '✓ Aprobar'}
                      </button>
                    )}
                    <button
                      onClick={() => handleRechazar(item.id)}
                      disabled={procesandoId === item.id}
                      style={{ flex: 1, backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                      {procesandoId === item.id ? '...' : '✕ Rechazar'}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}