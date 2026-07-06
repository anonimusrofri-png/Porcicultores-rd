'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Perfil() {
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
  const [claveEntrada, setClaveEntrada] = useState('')
  const [errorClave, setErrorClave] = useState(false)
  const [tabActiva, setTabActiva] = useState('pendientes')
  const [adminPublicaciones, setAdminPublicaciones] = useState<any[]>([])
  const [adminUsuarios, setAdminUsuarios] = useState<any[]>([])
  const [adminReportes, setAdminReportes] = useState<any[]>([])
  const [adminPrecios, setAdminPrecios] = useState<any[]>([])
  const [adminDirectorio, setAdminDirectorio] = useState<any[]>([])
  const [editandoPrecio, setEditandoPrecio] = useState<any>(null)
  const [nuevoPrecioLibra, setNuevoPrecioLibra] = useState('')
  const [nuevoPrecioKilo, setNuevoPrecioKilo] = useState('')
  const [stats, setStats] = useState({ pendientes: 0, usuarios: 0, reportes: 0, suspendidos: 0, recaudado: 0 })

  useEffect(() => { cargarPerfil() }, [])

  const cargarPerfil = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    const { data: p } = await supabase.from('perfiles').select('*').eq('id', user.id).single()
    const { data: pubs } = await supabase.from('publicaciones').select('*').eq('usuario_id', user.id).order('created_at', { ascending: false })
    const { data: adminCheck } = await supabase.from('administradores').select('id').eq('id', user.id).single()
    setPerfil(p)
    setNombre(p?.nombre || '')
    setTelefono(p?.telefono || '')
    setDescripcion(p?.descripcion || '')
    setPrevistaFoto(p?.foto_perfil || null)
    setPublicaciones(pubs || [])
    if (adminCheck && user.email === 'anonimusrofri@gmail.com') {
      setEsAdmin(true)
      await cargarDatosAdmin()
    }
    setCargando(false)
  }

  const verificarClave = async () => {
    if (claveEntrada === 'PorcicultoresRD2026') {
      setEsAdmin(true)
      setErrorClave(false)
      await cargarDatosAdmin()
    } else {
      setErrorClave(true)
    }
  }

  const cargarDatosAdmin = async () => {
    const [{ data: pend }, { data: users }, { data: reps }, { data: precios }, { data: dir }, { data: apoyos }] = await Promise.all([
      supabase.from('publicaciones').select('*, perfiles(nombre)').eq('estado', 'pendiente').order('created_at', { ascending: false }),
      supabase.from('perfiles').select('*').order('nombre'),
      supabase.from('reportes').select('*').order('created_at', { ascending: false }),
      supabase.from('precios_cerdo').select('*').order('provincia'),
      supabase.from('directorio').select('*').order('nombre'),
      supabase.from('apoyos').select('monto'),
    ])
    setAdminPublicaciones(pend || [])
    setAdminUsuarios(users || [])
    setAdminReportes(reps || [])
    setAdminPrecios(precios || [])
    setAdminDirectorio(dir || [])
    const totalRecaudado = apoyos?.reduce((s, a) => s + (a.monto || 0), 0) || 0
    setStats({
      pendientes: pend?.length || 0,
      usuarios: users?.length || 0,
      reportes: reps?.filter(r => !r.resuelto).length || 0,
      suspendidos: users?.filter(u => u.estado === 'suspendido').length || 0,
      recaudado: totalRecaudado
    })
  }

  const cambiarEstadoPub = async (id: string, estado: string) => {
    await supabase.from('publicaciones').update({ estado, activo: estado === 'aprobada' }).eq('id', id)
    cargarDatosAdmin()
  }

  const eliminarPub = async (id: string) => {
    if (!confirm('¿Eliminar esta publicación permanentemente?')) return
    await supabase.from('publicaciones').delete().eq('id', id)
    cargarDatosAdmin()
  }

  const suspenderUsuario = async (id: string) => {
    await supabase.from('perfiles').update({ estado: 'suspendido' }).eq('id', id)
    cargarDatosAdmin()
  }

  const activarUsuario = async (id: string) => {
    await supabase.from('perfiles').update({ estado: 'activo' }).eq('id', id)
    cargarDatosAdmin()
  }

  const verificarUsuario = async (id: string) => {
    await supabase.from('perfiles').update({ verificado: true, estado: 'verificado' }).eq('id', id)
    cargarDatosAdmin()
  }

  const eliminarUsuario = async (id: string) => {
    if (!confirm('¿Eliminar este usuario permanentemente?')) return
    await supabase.from('perfiles').delete().eq('id', id)
    cargarDatosAdmin()
  }

  const resolverReporte = async (id: string) => {
    await supabase.from('reportes').update({ resuelto: true }).eq('id', id)
    cargarDatosAdmin()
  }

  const guardarPrecio = async () => {
    if (!editandoPrecio) return
    await supabase.from('precios_cerdo').update({
      precio_libra: parseFloat(nuevoPrecioLibra),
      precio_kilo: parseFloat(nuevoPrecioKilo),
      fecha: new Date().toISOString().slice(0, 10)
    }).eq('id', editandoPrecio.id)
    setEditandoPrecio(null)
    cargarDatosAdmin()
  }

  const eliminarNegocio = async (id: string) => {
    await supabase.from('directorio').delete().eq('id', id)
    cargarDatosAdmin()
  }

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setFotoPerfil(file); setPrevistaFoto(URL.createObjectURL(file)) }
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
    cargarPerfil()
    setGuardando(false)
  }

  const eliminarMiPublicacion = async (id: string) => {
    await supabase.from('publicaciones').delete().eq('id', id)
    cargarPerfil()
  }

  const marcarVendido = async (id: string) => {
    await supabase.from('publicaciones').update({ estado: 'vendida', activo: false }).eq('id', id)
    cargarPerfil()
  }

  if (cargando) return <p style={{ padding: '40px', fontFamily: 'sans-serif' }}>Cargando perfil...</p>

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900', margin: 0 }}>Mi Perfil</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0a2463, #1565c0)', borderRadius: '20px', padding: '32px', marginBottom: '24px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div onClick={() => editando && document.getElementById('inputFotoPerfil')?.click()}
              style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: '900', color: 'white', border: '3px solid rgba(255,255,255,0.4)', overflow: 'hidden', cursor: editando ? 'pointer' : 'default' }}>
              {previstaFoto ? <img src={previstaFoto} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : perfil?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900' }}>{perfil?.nombre}</h2>
              <p style={{ margin: '4px 0', opacity: 0.8, fontSize: '14px' }}>{perfil?.provincia}</p>
              {esAdmin && <span style={{ backgroundColor: '#c1121f', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Administradora</span>}
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                {[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= Math.round(perfil?.estrellas || 0) ? '#fbbf24' : 'rgba(255,255,255,0.3)', fontSize: '16px' }}>★</span>)}
              </div>
            </div>
          </div>
          <button onClick={() => setEditando(!editando)}
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
            {editando ? 'Cancelar' : 'Editar'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
          {[
            { label: 'Publicaciones', valor: publicaciones.length },
            { label: 'Tipo', valor: esAdmin ? 'Administradora' : (perfil?.tipo || 'vendedor') },
            { label: 'Estado', valor: perfil?.estado || 'activo' },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '900', textTransform: 'capitalize' }}>{s.valor}</div>
              <div style={{ opacity: 0.7, fontSize: '12px', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {editando && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#0a2463', marginBottom: '16px', fontWeight: '700' }}>Editar Perfil</h3>
          <input id="inputFotoPerfil" type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
          <button onClick={() => document.getElementById('inputFotoPerfil')?.click()}
            style={{ backgroundColor: '#f0f4f8', color: '#0a2463', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', marginBottom: '16px' }}>
            Cambiar Foto de Perfil
          </button>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre"
            style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Telefono / WhatsApp"
            style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripcion" rows={3}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
          <button onClick={guardarPerfil} disabled={guardando}
            style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Link href="/publicar" style={{ backgroundColor: '#0a2463', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Nueva Publicacion</Link>
        <Link href="/chat" style={{ backgroundColor: 'white', color: '#0a2463', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: '1px solid #e2e8f0' }}>Mensajes</Link>
        <Link href="/notificaciones" style={{ backgroundColor: 'white', color: '#0a2463', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: '1px solid #e2e8f0' }}>Notificaciones</Link>
        <Link href="/resena" style={{ backgroundColor: 'white', color: '#0a2463', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: '1px solid #e2e8f0' }}>Dejar Resena</Link>
      </div>

      {!esAdmin && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <h4 style={{ color: '#0a2463', fontWeight: '800', margin: '0 0 8px 0' }}>Acceso de Administradora</h4>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 14px 0' }}>Ingresa el codigo maestro para gestionar la plataforma.</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="password" placeholder="Codigo maestro..." value={claveEntrada}
              onChange={(e) => setClaveEntrada(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verificarClave()}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: errorClave ? '2px solid #dc2626' : '1px solid #e2e8f0', fontSize: '14px' }} />
            <button onClick={verificarClave}
              style={{ backgroundColor: '#0a2463', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
              Entrar
            </button>
          </div>
          {errorClave && <p style={{ color: '#dc2626', fontSize: '12px', margin: '8px 0 0 0', fontWeight: '600' }}>Codigo incorrecto.</p>}
        </div>
      )}

      {esAdmin && (
        <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '32px', marginBottom: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#0a2463', fontSize: '26px', fontWeight: '800', margin: '0 0 4px 0' }}>Panel de Administracion</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Moderacion y control de la plataforma</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Pendientes', valor: stats.pendientes, bg: '#fffbeb', border: '#fef08a', color: '#713f12' },
              { label: 'Usuarios', valor: stats.usuarios, bg: '#f0f9ff', border: '#bae6fd', color: '#0369a1' },
              { label: 'Reportes', valor: stats.reportes, bg: '#fef2f2', border: '#fecaca', color: '#b91c1c' },
              { label: 'Suspendidos', valor: stats.suspendidos, bg: '#faf5ff', border: '#e9d5ff', color: '#6b21a8' },
              { label: 'Recaudado', valor: `RD$ ${stats.recaudado.toLocaleString()}`, bg: '#f0fdf4', border: '#bbf7d0', color: '#166534' },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#0a2463' }}>{s.valor}</div>
                <div style={{ color: s.color, fontSize: '11px', fontWeight: '700', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap' }}>
            {[
              { id: 'pendientes', label: `Pendientes (${stats.pendientes})` },
              { id: 'usuarios', label: `Usuarios (${stats.usuarios})` },
              { id: 'directorio', label: `Directorio (${adminDirectorio.length})` },
              { id: 'reportes', label: `Reportes (${stats.reportes})` },
              { id: 'precios', label: 'Precios' },
            ].map(t => (
              <button key={t.id} onClick={() => setTabActiva(t.id)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '13px', backgroundColor: tabActiva === t.id ? '#0a2463' : '#f1f5f9', color: tabActiva === t.id ? 'white' : '#64748b' }}>
                {t.label}
              </button>
            ))}
          </div>

          {tabActiva === 'pendientes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {adminPublicaciones.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#94a3b8' }}>No hay publicaciones pendientes</div>
              ) : adminPublicaciones.map((pub) => (
                <div key={pub.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                    <div style={{ width: '90px', height: '90px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f1f5f9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                      {pub.foto_url ? <img src={pub.foto_url} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🐖'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <span style={{ backgroundColor: '#fef9c3', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>Pendiente</span>
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{pub.tipo_animal === 'verraco' ? 'Barraco' : pub.tipo_animal}</span>
                      </div>
                      <p style={{ fontWeight: '900', color: '#16a34a', fontSize: '18px', margin: '0 0 4px 0' }}>RD$ {pub.precio?.toLocaleString()}</p>
                      <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px 0' }}>Provincia: {pub.provincia} — Peso: {pub.peso} lbs</p>
                      <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px 0' }}>Vendedor: {pub.perfiles?.nombre}</p>
                      <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>{pub.descripcion}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                    <button onClick={() => cambiarEstadoPub(pub.id, 'aprobada')} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Aprobar</button>
                    <button onClick={() => cambiarEstadoPub(pub.id, 'rechazada')} style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Rechazar</button>
                    <button onClick={() => eliminarPub(pub.id)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Eliminar</button>
                    <button onClick={() => cambiarEstadoPub(pub.id, 'vendida')} style={{ backgroundColor: '#4338ca', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Vendida</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tabActiva === 'usuarios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {adminUsuarios.map((u) => (
                <div key={u.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0a2463', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', overflow: 'hidden', flexShrink: 0 }}>
                      {u.foto_perfil ? <img src={u.foto_perfil} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', color: '#0a2463', fontSize: '14px', margin: '0 0 2px 0' }}>{u.nombre}</p>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{u.tipo} — {u.provincia}</p>
                      <span style={{ backgroundColor: u.estado === 'suspendido' ? '#fee2e2' : u.estado === 'verificado' ? '#dcfce7' : '#f1f5f9', color: u.estado === 'suspendido' ? '#dc2626' : u.estado === 'verificado' ? '#16a34a' : '#64748b', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                        {u.estado || 'activo'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {u.estado !== 'verificado' && <button onClick={() => verificarUsuario(u.id)} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Verificar</button>}
                    {u.estado === 'suspendido' ? (
                      <button onClick={() => activarUsuario(u.id)} style={{ backgroundColor: '#0a2463', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Activar</button>
                    ) : (
                      <button onClick={() => suspenderUsuario(u.id)} style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Suspender</button>
                    )}
                    <button onClick={() => eliminarUsuario(u.id)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tabActiva === 'directorio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {adminDirectorio.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#94a3b8' }}>No hay negocios en el directorio</div>
              ) : adminDirectorio.map((neg) => (
                <div key={neg.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <p style={{ fontWeight: '700', color: '#0a2463', margin: '0 0 4px 0' }}>{neg.nombre}</p>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>{neg.categoria} — {neg.provincia}</p>
                  </div>
                  <button onClick={() => eliminarNegocio(neg.id)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Eliminar</button>
                </div>
              ))}
            </div>
          )}

          {tabActiva === 'reportes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {adminReportes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#94a3b8' }}>No hay reportes</div>
              ) : adminReportes.map((r) => (
                <div key={r.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <p style={{ fontWeight: '700', color: '#0a2463', margin: '0 0 4px 0' }}>Motivo: {r.motivo}</p>
                    {r.descripcion && <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>{r.descripcion}</p>}
                    <span style={{ backgroundColor: r.resuelto ? '#dcfce7' : '#fee2e2', color: r.resuelto ? '#16a34a' : '#dc2626', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                      {r.resuelto ? 'Resuelto' : 'Pendiente'}
                    </span>
                  </div>
                  {!r.resuelto && <button onClick={() => resolverReporte(r.id)} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Resolver</button>}
                </div>
              ))}
            </div>
          )}

          {tabActiva === 'precios' && (
            <div>
              {editandoPrecio && (
                <div style={{ backgroundColor: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                  <h3 style={{ color: '#0a2463', margin: '0 0 12px 0', fontWeight: '700' }}>Editando: {editandoPrecio.provincia}</h3>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Precio/Libra (RD$)</label>
                      <input type="number" value={nuevoPrecioLibra} onChange={(e) => setNuevoPrecioLibra(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', width: '150px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Precio/Kilo (RD$)</label>
                      <input type="number" value={nuevoPrecioKilo} onChange={(e) => setNuevoPrecioKilo(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', width: '150px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={guardarPrecio} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Guardar</button>
                    <button onClick={() => setEditandoPrecio(null)} style={{ backgroundColor: '#64748b', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Cancelar</button>
                  </div>
                </div>
              )}
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0a2463', color: 'white' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Provincia</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px' }}>Precio/Libra</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px' }}>Precio/Kilo</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px' }}>Editar</th>
                  </tr>
                </thead>
                <tbody>
                  {adminPrecios.map((p, i) => (
                    <tr key={p.id} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0a2463' }}>{p.provincia}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#16a34a', fontWeight: '700' }}>RD$ {p.precio_libra}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#16a34a', fontWeight: '700' }}>RD$ {p.precio_kilo}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button onClick={() => { setEditandoPrecio(p); setNuevoPrecioLibra(p.precio_libra); setNuevoPrecioKilo(p.precio_kilo) }}
                          style={{ backgroundColor: '#0a2463', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <h2 style={{ color: '#0a2463', marginBottom: '16px', fontWeight: '800' }}>Mis Publicaciones ({publicaciones.length})</h2>
      {publicaciones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#94a3b8', marginBottom: '12px' }}>No tienes publicaciones todavia</p>
          <Link href="/publicar" style={{ color: '#0a2463', fontWeight: '700', textDecoration: 'none' }}>Crear publicacion</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {publicaciones.map((pub) => (
            <div key={pub.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {pub.foto_url && <img src={pub.foto_url} alt="foto" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />}
                <div>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginRight: '8px' }}>{pub.tipo_animal === 'verraco' ? 'Barraco' : pub.tipo_animal}</span>
                  <span style={{ color: '#16a34a', fontWeight: '900', fontSize: '16px' }}>RD$ {pub.precio?.toLocaleString()}</span>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0 0' }}>{pub.provincia} — {pub.peso} lbs</p>
                  <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0 0' }}>{pub.descripcion}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                <span style={{ backgroundColor: pub.estado === 'aprobada' ? '#dcfce7' : pub.estado === 'rechazada' ? '#fee2e2' : pub.estado === 'vendida' ? '#e0e7ff' : '#fef9c3', color: pub.estado === 'aprobada' ? '#16a34a' : pub.estado === 'rechazada' ? '#dc2626' : pub.estado === 'vendida' ? '#4338ca' : '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                  {pub.estado || 'pendiente'}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {pub.estado === 'aprobada' && (
                    <button onClick={() => marcarVendido(pub.id)} style={{ backgroundColor: '#dcfce7', color: '#16a34a', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Vendido</button>
                  )}
                  <button onClick={() => eliminarMiPublicacion(pub.id)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}