'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Admin() {
  const [esAdmin, setEsAdmin] = useState(false)
  const [cargandoAuth, setCargandoAuth] = useState(true)
  const [pendientes, setPendientes] = useState<any[]>([])
  const [usuariosCount, setUsuariosCount] = useState(0)
  const [reportesCount, setReportesCount] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [procesandoId, setProcesandoId] = useState<string | null>(null)
  const [filtroTab, setFiltroTab] = useState<'pendiente' | 'usuarios' | 'reportes' | 'apoyos' | 'precios'>('pendiente')

  // 1. Verificar si el usuario autenticado es el administrador
  useEffect(() => {
    verificarAdministrador()
  }, [])

  // 2. Cargar datos solo si es el admin
  useEffect(() => {
    if (esAdmin) {
      cargarDatos()
    }
  }, [esAdmin, filtroTab])

  const verificarAdministrador = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user?.email === 'anonimusrofri@gmail.com') {
      setEsAdmin(true)
    } else {
      setEsAdmin(false)
    }
    setCargandoAuth(false)
  }

  const cargarDatos = async () => {
    setCargando(true)
    if (filtroTab === 'pendiente') {
      const { data, error } = await supabase
        .from('publicaciones')
        .select('*, perfiles:usuario_id(nombre, telefono, email)')
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: false })

      if (!error) setPendientes(data || [])
    }

    const { count: cUsuarios } = await supabase.from('perfiles').select('*', { count: 'exact', head: true })
    if (cUsuarios !== null) setUsuariosCount(cUsuarios)

    const { count: cReportes } = await supabase.from('publicaciones').select('*', { count: 'exact', head: true }).eq('estado', 'rechazado')
    if (cReportes !== null) setReportesCount(cReportes)

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

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar permanentemente esta publicación?')) return

    setProcesandoId(id)
    const { error } = await supabase
      .from('publicaciones')
      .delete()
      .eq('id', id)

    if (!error) {
      setPendientes(prev => prev.filter(p => p.id !== id))
    } else {
      alert('Error al eliminar la publicación')
    }
    setProcesandoId(null)
  }

  if (cargandoAuth) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#64748B' }}>Verificando credenciales...</div>
  }

  // Si no es el administrador autorizado, se muestra la tarjeta de bloqueo
  if (!esAdmin) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '40px 32px', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '460px', width: '100%' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 10px 0', color: '#0F172A', fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
            Acceso Denegado
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 28px 0', lineHeight: '1.6' }}>
            Esta sección es exclusiva para la administración general de la plataforma. Inicia sesión con la cuenta de administrador autorizada.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/login" style={{ backgroundColor: '#0B2545', color: '#FFFFFF', padding: '12px 20px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', flex: 1, textAlign: 'center' }}>
              Iniciar Sesión
            </Link>
            <Link href="/" style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '12px 20px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', border: '1px solid #CBD5E1', flex: 1, textAlign: 'center' }}>
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Si SÍ es el admin, se muestra el panel completo
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: "'Inter', sans-serif", padding: '30px 20px', backgroundColor: '#F8FAFC', minHeight: '100vh', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B2545', margin: '0 0 6px 0' }}>Panel de Administracion</h1>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Administrador: anonimusrofri@gmail.com</p>
        </div>
        <Link href="/" style={{ color: '#0B2545', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
          Volver al inicio
        </Link>
      </div>

      {/* Tarjetas Superiores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#FEF08A', border: '1px solid #FDE047', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#854D0E' }}>{pendientes.length}</div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#A16207', textTransform: 'uppercase', marginTop: '4px' }}>Pendientes</div>
        </div>
        <div style={{ backgroundColor: '#E0F2FE', border: '1px solid #BAE6FD', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0369A1' }}>{usuariosCount}</div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#0284C7', textTransform: 'uppercase', marginTop: '4px' }}>Usuarios</div>
        </div>
        <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#B91C1C' }}>{reportesCount}</div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#DC2626', textTransform: 'uppercase', marginTop: '4px' }}>Reportes</div>
        </div>
        <div style={{ backgroundColor: '#F3E8FF', border: '1px solid #E9D5FF', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#6B21A8' }}>0</div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#9333EA', textTransform: 'uppercase', marginTop: '4px' }}>Suspendidos</div>
        </div>
        <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#15803D' }}>RD$ 0</div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#16A34A', textTransform: 'uppercase', marginTop: '4px' }}>Recaudado</div>
        </div>
      </div>

      {/* Pestañas de Navegación */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px', marginBottom: '24px', overflowX: 'auto' }}>
        {[
          { key: 'pendiente', label: `Pendientes (${pendientes.length})` },
          { key: 'usuarios', label: `Usuarios (${usuariosCount})` },
          { key: 'reportes', label: `Reportes (${reportesCount})` },
          { key: 'apoyos', label: 'Apoyos (0)' },
          { key: 'precios', label: 'Precios' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFiltroTab(tab.key as any)}
            style={{
              backgroundColor: filtroTab === tab.key ? '#0B2545' : 'transparent',
              color: filtroTab === tab.key ? '#FFFFFF' : '#64748B',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listado */}
      {cargando ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>Cargando datos del panel...</div>
      ) : filtroTab === 'pendiente' && pendientes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', color: '#64748B' }}>
          🎉 No hay publicaciones pendientes de revisión.
        </div>
      ) : filtroTab === 'pendiente' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pendientes.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ width: '130px', height: '100px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden', flexShrink: '0' }}>
                {item.foto_url ? (
                  <img src={item.foto_url} alt={item.tipo_animal} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>🐷</div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: '250px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>Pendiente</span>
                  <span style={{ backgroundColor: '#E0F2FE', color: '#0369A1', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>{item.tipo_animal}</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0B2545', marginBottom: '4px' }}>
                  RD$ {item.precio ? Number(item.precio).toLocaleString('es-DO') : '0'}
                </div>
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
                  Provincia: <strong>{item.provincia}</strong> {item.peso ? `— Peso: ${item.peso} lbs` : ''}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>
                  Vendedor: <strong>{item.perfiles?.email || item.perfiles?.nombre || 'Desconocido'}</strong>
                </div>
                <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: '1.4' }}>{item.descripcion}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '130px' }}>
                <button
                  onClick={() => handleAprobar(item.id)}
                  disabled={procesandoId === item.id}
                  style={{ backgroundColor: '#16A34A', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textAlign: 'center' }}
                >
                  {procesandoId === item.id ? '...' : 'Aprobar'}
                </button>
                <button
                  onClick={() => handleRechazar(item.id)}
                  disabled={procesandoId === item.id}
                  style={{ backgroundColor: '#D97706', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textAlign: 'center' }}
                >
                  {procesandoId === item.id ? '...' : 'Rechazar'}
                </button>
                <button
                  onClick={() => handleEliminar(item.id)}
                  disabled={procesandoId === item.id}
                  style={{ backgroundColor: '#DC2626', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textAlign: 'center' }}
                >
                  {procesandoId === item.id ? '...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B' }}>
          Sección de <strong>{filtroTab}</strong> en visualización general.
        </div>
      )}
    </div>
  )
}