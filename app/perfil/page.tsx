'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Perfil() {
  // Estados del Perfil de Usuario
  const [perfil, setPerfil] = useState<any>(null)
  const [publicaciones, setPublicaciones] = useState<any[]>([])
  const [esAdmin, setEsAdmin] = useState(false)
  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null)
  const [previstaFoto, setPrevistaFoto] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  // ESTADO PARA LA CONTRASEÑA MAESTRA
  const [claveEntrada, setClaveEntrada] = useState('')
  const [errorClave, setErrorClave] = useState(false)

  // Estados del Panel de Administración Integrado
  const [tabActiva, setTabActiva] = useState('pendientes')
  const [adminPublicaciones, setAdminPublicaciones] = useState<any[]>([])
  const [stats, setStats] = useState({
    pendientes: 0,
    usuarios: 0,
    reportes: 0,
    suspendidos: 0,
    recaudado: 0
  })

  useEffect(() => {
    cargarPerfilYData()
  }, [])

  const cargarPerfilYData = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { 
      window.location.href = '/login'
      return 
    }

    // Cargar datos del perfil del usuario
    const { data: p } = await supabase.from('perfiles').select('*').eq('id', user.id).single()
    const { data: pubs } = await supabase.from('publicaciones').select('*').eq('usuario_id', user.id).order('created_at', { ascending: false })
    
    setPerfil(p)
    setNombre(p?.nombre || '')
    setTelefono(p?.telefono || '')
    setDescripcion(p?.descripcion || '')
    setPrevistaFoto(p?.foto_perfil || null)
    setPublicaciones(pubs || [])

    setCargando(false)
  }

  // Función para activar el modo administrador con contraseña
  const verificarAccesoAdmin = async () => {
    // AQUÍ PUEDES CAMBIAR LA CONTRASEÑA SI DESEAS
    if (claveEntrada === 'admin2026') {
      setErrorClave(false)
      setEsAdmin(true)
      await cargarDatosAdministracion()
    } else {
      setErrorClave(true)
      setEsAdmin(false)
    }
  }

  const cargarDatosAdministracion = async () => {
    const { data: pendientes } = await supabase
      .from('publicaciones')
      .select('*')
      .eq('estado', 'pendiente')
      .order('created_at', { ascending: false })

    const { count: totalPendientes } = await supabase.from('publicaciones').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente')
    const { count: totalUsuarios } = await supabase.from('perfiles').select('*', { count: 'exact', head: true })
    const { count: totalReportes } = await supabase.from('reportes').select('*', { count: 'exact', head: true })
    const { count: totalSuspendidos } = await supabase.from('perfiles').select('*', { count: 'exact', head: true }).eq('estado', 'suspendido')
    
    const { data: apoyos } = await supabase.from('apoyos').select('monto')
    const totalRecaudado = apoyos?.reduce((sum, item) => sum + (item.monto || 0), 0) || 0

    setAdminPublicaciones(pendientes || [])
    setStats({
      pendientes: totalPendientes || 0,
      usuarios: totalUsuarios || 0,
      reportes: totalReportes || 0,
      suspendidos: totalSuspendidos || 0,
      recaudado: totalRecaudado
    })
  }

  const modificarEstadoPublicacion = async (id: string, nuevoEstado: string) => {
    const { error } = await supabase.from('publicaciones').update({ estado: nuevoEstado }).eq('id', id)
    if (error) alert('Error: ' + error.message)
    else await cargarDatosAdministracion()
  }

  const eliminarPublicacionAdmin = async (id: string) => {
    if (!confirm('¿Eliminar permanentemente?')) return
    const { error } = await supabase.from('publicaciones').delete().eq('id', id)
    if (error) alert('Error: ' + error.message)
    else await cargarDatosAdministracion()
  }

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFotoPerfil(file)
      setPrevistaFoto(URL.createObjectURL(file))
    }
  }

  const guardarPerfil = async () => {
    setGuardando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let fotoUrl = perfil?.foto_perfil || null

    if (fotoPerfil) {
      const ext = fotoPerfil.name.split('.').pop()
      const fileName = `perfil_${user.id}_${Date.now()}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage.from('publicaciones').upload(fileName, fotoPerfil)
      
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('publicaciones').getPublicUrl(fileName)
        fotoUrl = urlData.publicUrl
      }
    }

    await supabase.from('perfiles').update({ nombre, telefono, whatsapp: telefono, descripcion, foto_perfil: fotoUrl }).eq('id', user.id)
    setEditando(false)
    cargarPerfilYData()
    setGuardando(false)
  }

  if (cargando) return <p style={{ padding: '40px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Cargando datos de perfil...</p>

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc' }}>
      
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '28px', fontWeight: '900', margin: 0 }}>Mi Perfil</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '15px', fontWeight: '700' }}>Inicio</Link>
      </div>

      {/* Tarjeta de Perfil */}
      <div style={{ background: 'linear-gradient(135deg, #0a2463, #1e40af)', borderRadius: '20px', padding: '32px', marginBottom: '24px', color: 'white', boxShadow: '0 4px 15px rgba(10,36,99,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div onClick={() => editando && document.getElementById('inputFotoPerfil')?.click()}
              style={{ width: '84px', height: '84px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '900', color: 'white', border: '3px solid rgba(255,255,255,0.4)', overflow: 'hidden', cursor: editando ? 'pointer' : 'default' }}>
              {previstaFoto ? <img src={previstaFoto} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : perfil?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '900' }}>{perfil?.nombre || 'Noelia'}</h2>
              <p style={{ margin: '4px 0', opacity: 0.8, fontSize: '15px' }}>{perfil?.provincia || 'Monte Cristi'}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                {[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= Math.round(perfil?.estrellas || 0) ? '#fbbf24' : 'rgba(255,255,255,0.3)', fontSize: '16px' }}>★</span>)}
                <span style={{ fontSize: '13px', opacity: 0.8 }}>({publicaciones.length})</span>
              </div>
            </div>
          </div>
          <button onClick={() => setEditando(!editando)}
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 24px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
            {editando ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '28px' }}>
          {[
            { label: 'Publicaciones', valor: publicaciones.length },
            { label: 'Tipo', valor: esAdmin ? 'Administrador' : (perfil?.tipo || 'vendedor') },
            { label: 'Estado', valor: perfil?.estado || 'activo' },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', textAlign: 'center', backdropFilter: 'blur(5px)' }}>
              <div style={{ fontSize: '22px', fontWeight: '900', textTransform: 'capitalize' }}>{s.valor}</div>
              <div style={{ opacity: 0.7, fontSize: '13px', marginTop: '4px', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN ACCESO SEGURO PARA ADMINISTRADOR */}
      {!esAdmin && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <h4 style={{ margin: '0 0 4px 0', color: '#0a2463', fontWeight: '800' }}>🔑 ¿Eres Administrador de la Plataforma?</h4>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Ingresa el código maestro para habilitar tus herramientas de gestión.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="password" 
              placeholder="Código maestro..." 
              value={claveEntrada}
              onChange={(e) => setClaveEntrada(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '8px', border: errorClave ? '2px solid #dc2626' : '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
            />
            <button 
              onClick={verificarAccesoAdmin}
              style={{ backgroundColor: '#0a2463', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
            >
              Verificar
            </button>
          </div>
          {errorClave && <p style={{ color: '#dc2626', fontSize: '12px', width: '100%', margin: '4px 0 0 0', fontWeight: '600' }}>⚠️ Código incorrecto. Inténtalo de nuevo.</p>}
        </div>
      )}

      {/* Formulario Editable */}
      {editando && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#0a2463', marginBottom: '16px', fontWeight: '700', margin: '0 0 16px 0' }}>Editar Datos de Perfil</h3>
          <input id="inputFotoPerfil" type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
          <button onClick={() => document.getElementById('inputFotoPerfil')?.click()}
            style={{ backgroundColor: '#f1f5f9', color: '#0a2463', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', marginBottom: '16px' }}>
            Seleccionar Foto Nueva
          </button>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Sobre ti..." rows={3} style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
          <button onClick={guardarPerfil} disabled={guardando} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      )}

      {/* Botones de Navegación */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <Link href="/publicar" style={{ backgroundColor: '#0a2463', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Nueva Publicacion</Link>
        <Link href="/chat" style={{ backgroundColor: 'white', color: '#0a2463', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: '1px solid #e2e8f0' }}>Mensajes Privados</Link>
        <Link href="/resena" style={{ backgroundColor: 'white', color: '#0a2463', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: '1px solid #e2e8f0' }}>Dejar Resena</Link>
      </div>

      {/* PANEL DE ADMINISTRACIÓN COMPLETO */}
      {esAdmin && (
        <div style={{ marginTop: '20px', borderTop: '2px solid #e2e8f0', paddingTop: '32px', marginBottom: '40px' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#0a2463', fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0' }}>Panel de Administracion</h2>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Moderacion y control de la plataforma</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef08a', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b' }}>{stats.pendientes}</div>
              <div style={{ color: '#713f12', fontSize: '13px', fontWeight: '700', marginTop: '2px' }}>Pendientes</div>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b' }}>{stats.usuarios}</div>
              <div style={{ color: '#0369a1', fontSize: '13px', fontWeight: '700', marginTop: '2px' }}>Usuarios</div>
            </div>
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b' }}>{stats.reportes}</div>
              <div style={{ color: '#b91c1c', fontSize: '13px', fontWeight: '700', marginTop: '2px' }}>Reportes</div>
            </div>
            <div style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b' }}>{stats.suspendidos}</div>
              <div style={{ color: '#6b21a8', fontSize: '13px', fontWeight: '700', marginTop: '2px' }}>Suspendidos</div>
            </div>
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#16a34a' }}>RD$ {stats.recaudado.toLocaleString()}</div>
              <div style={{ color: '#166534', fontSize: '13px', fontWeight: '700', marginTop: '4px' }}>Recaudado</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { id: 'pendientes', label: `Pendientes (${stats.pendientes})` },
              { id: 'usuarios', label: `Usuarios (${stats.usuarios})` },
              { id: 'reportes', label: `Reportes (${stats.reportes})` },
              { id: 'apoyos', label: 'Apoyos (0)' },
              { id: 'precios', label: 'Precios' },
            ].map(t => (
              <button key={t.id} onClick={() => setTabActiva(t.id)} style={{ backgroundColor: tabActiva === t.id ? '#0a2463' : '#e2e8f0', color: tabActiva === t.id ? 'white' : '#475569', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '32px' }}>
            {tabActiva === 'pendientes' && (
              <div>
                {adminPublicaciones.length === 0 ? (
                  <p style={{ color: '#64748b', fontStyle: 'italic', backgroundColor: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    No hay publicaciones pendientes de aprobación.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {adminPublicaciones.map((pub) => (
                      <div key={pub.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                          <div style={{ width: '100px', height: '100px', backgroundColor: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {pub.foto_url ? <img src={pub.foto_url} alt="Cerdo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '30px' }}>🐖</span>}
                          </div>
                          <div>
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                              <span style={{ backgroundColor: '#fef9c3', color: '#a16207', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Pendiente</span>
                              <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'lowercase' }}>{pub.tipo_animal || 'cerdo'}</span>
                            </div>
                            <div style={{ color: '#1e3a8a', fontWeight: '900', fontSize: '20px', marginBottom: '4px' }}>RD$ {pub.precio?.toLocaleString()}</div>
                            <p style={{ color: '#475569', fontSize: '14px', margin: '2px 0', fontWeight: '500' }}>Provincia: {pub.provincia} — Peso: {pub.peso || 0} lbs</p>
                            <p style={{ color: '#334155', fontSize: '14px', marginTop: '8px', fontStyle: 'italic' }}>"{pub.descripcion || 'Sin descripción'}"</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                          <button onClick={() => modificarEstadoPublicacion(pub.id, 'aprobada')} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Aprobar</button>
                          <button onClick={() => modificarEstadoPublicacion(pub.id, 'rechazada')} style={{ backgroundColor: '#f97316', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Rechazar</button>
                          <button onClick={() => eliminarPublicacionAdmin(pub.id)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Eliminar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mis Publicaciones de Usuario Final */}
      <h2 style={{ color: '#0a2463', marginBottom: '16px', fontWeight: '800', fontSize: '22px' }}>Mis Publicaciones ({publicaciones.length})</h2>
      {publicaciones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '15px' }}>No tienes publicaciones todavía</p>
          <Link href="/publicar" style={{ color: '#0a2463', fontWeight: '700', textDecoration: 'none' }}>Crear publicacion</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {publicaciones.map((pub) => (
            <div key={pub.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {pub.foto_url && <img src={pub.foto_url} alt="foto" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />}
                <div>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginRight: '8px' }}>{pub.tipo_animal}</span>
                  <span style={{ color: '#16a34a', fontWeight: '900', fontSize: '16px' }}>RD$ {pub.precio?.toLocaleString()}</span>
                  <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px', margin: 0 }}>{pub.provincia} — {pub.peso} lbs</p>
                </div>
              </div>
              <span style={{ backgroundColor: pub.estado === 'aprobada' ? '#dcfce7' : '#fee2e2', color: pub.estado === 'aprobada' ? '#16a34a' : '#dc2626', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                {pub.estado || 'pendiente'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}