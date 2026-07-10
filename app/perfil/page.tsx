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
    setPerfil(p)
    setNombre(p?.nombre || '')
    setTelefono(p?.telefono || '')
    setDescripcion(p?.descripcion || '')
    setPrevistaFoto(p?.foto_perfil || null)
    setPublicaciones(pubs || [])
    if (p?.es_admin === true || p?.tipo === 'admin') {
      setEsAdmin(true)
      await cargarDatosAdmin()
    }
    setCargando(false)
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
    const totalRecaudado = apoyos?.reduce((s: number, a: any) => s + (a.monto || 0), 0) || 0
    setStats({
      pendientes: pend?.length || 0,
      usuarios: users?.length || 0,
      reportes: reps?.filter((r: any) => !r.resuelto).length || 0,
      suspendidos: users?.filter((u: any) => u.estado === 'suspendido').length || 0,
      recaudado: totalRecaudado
    })
  }

  const cambiarEstadoPub = async (id: string, estado: string) => {
    const { error } = await supabase.from('publicaciones').update({ estado, activo: estado === 'aprobada' }).eq('id', id)
    if (error) { alert('Error al actualizar: ' + error.message); return }
    await cargarDatosAdmin()
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
    if (!confirm('¿Eliminar este negocio del directorio?')) return
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
    if (!confirm('¿Eliminar esta publicación?')) return
    await supabase.from('publicaciones').delete().eq('id', id)
    cargarPerfil()
  }

  const marcarVendido = async (id: string) => {
    await supabase.from('publicaciones').update({ estado: 'vendida', activo: false }).eq('id', id)
    cargarPerfil()
  }

  if (cargando) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F9', fontFamily: "'Inter', sans-serif" }}>
      <p style={{ color: '#6B7280' }}>Cargando perfil...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: "'Inter', sans-serif", backgroundColor: '#F4F6F9', minHeight: '100vh' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#1A3C5E', fontSize: '22px', fontWeight: '700', margin: 0 }}>Mi Perfil</h1>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>← Inicio</Link>
      </div>

      {/* Hero card */}
      <div style={{ background: 'linear-gradient(180deg, #1A3C5E 0%, #2563A8 50%, #1B5E20 100%)', borderRadius: '20px', padding: '32px', marginBottom: '20px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div onClick={() => editando && document.getElementById('inputFotoPerfil')?.click()}
              style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#1A3C5E', border: '3px solid rgba(255,255,255,0.5)', overflow: 'hidden', cursor: editando ? 'pointer' : 'default', flexShrink: 0 }}>
              {previstaFoto ? <img src={previstaFoto} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : perfil?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700' }}>{perfil?.nombre}</h2>
              <p style={{ margin: '0 0 6px 0', opacity: 0.8, fontSize: '13px' }}>📍 {perfil?.provincia}</p>
              {esAdmin && <span style={{ backgroundColor: '#EF4444', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>⚙️ Administrador</span>}
              <div style={{ display: 'flex', gap: '2px', marginTop: '6px' }}>
                {[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= Math.round(perfil?.estrellas || 0) ? '#F59E0B' : 'rgba(255,255,255,0.3)', fontSize: '16px' }}>★</span>)}
              </div>
            </div>
          </div>
          <button onClick={() => setEditando(!editando)}
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
            {editando ? 'Cancelar' : 'Editar'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '24px' }}>
          {[
            { label: 'Publicaciones', valor: publicaciones.length },
            { label: 'Tipo', valor: esAdmin ? 'Admin' : (perfil?.tipo || 'usuario') },
            { label: 'Estado', valor: perfil?.estado || 'activo' },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', textTransform: 'capitalize' }}>{s.valor}</div>
              <div style={{ opacity: 0.7, fontSize: '12px', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Editar perfil */}
      {editando && (
        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ color: '#1A3C5E', marginBottom: '16px', fontWeight: '700' }}>Editar Perfil</h3>
          <input id="inputFotoPerfil" type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
          <button onClick={() => document.getElementById('inputFotoPerfil')?.click()}
            style={{ backgroundColor: '#EFF6FF', color: '#2563A8', border: '1px solid #BFDBFE', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginBottom: '16px' }}>
            📷 Cambiar Foto
          </button>
          {[
            { placeholder: 'Nombre', value: nombre, onChange: setNombre },
            { placeholder: 'Teléfono / WhatsApp', value: telefono, onChange: setTelefono },
          ].map(f => (
            <input key={f.placeholder} value={f.value} onChange={(e) => f.onChange(e.target.value)} placeholder={f.placeholder}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#F9FAFB' }} />
          ))}
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" rows={3}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#F9FAFB' }} />
          <button onClick={guardarPerfil} disabled={guardando}
            style={{ background: 'linear-gradient(135deg, #1A3C5E, #2563A8)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
            {guardando ? 'Guardando...' : '✓ Guardar Cambios'}
          </button>
        </div>
      )}

      {/* Botones de acción */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { href: '/publicar', label: '+ Nueva Publicación', bg: '#1A3C5E', color: 'white' },
          { href: '/chat', label: '💬 Mensajes', bg: 'white', color: '#1A3C5E' },
          { href: '/notificaciones', label: '🔔 Notificaciones', bg: 'white', color: '#1A3C5E' },
          { href: '/resena', label: '⭐ Dejar Reseña', bg: 'white', color: '#1A3C5E' },
        ].map(b => (
          <Link key={b.href} href={b.href} style={{ backgroundColor: b.bg, color: b.color, padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', border: b.bg === 'white' ? '1px solid #E5E7EB' : 'none' }}>
            {b.label}
          </Link>
        ))}
      </div>

      {/* Panel Admin — solo si es admin */}
      {esAdmin && (
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', marginBottom: '24px', border: '1px solid #E5E7EB' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: '#1A3C5E', fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0' }}>⚙️ Panel de Administración</h2>
            <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Moderación y control de la plataforma</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Pendientes', valor: stats.pendientes, bg: '#FEF3C7', color: '#D97706' },
              { label: 'Usuarios', valor: stats.usuarios, bg: '#DBEAFE', color: '#1D4ED8' },
              { label: 'Reportes', valor: stats.reportes, bg: '#FEE2E2', color: '#DC2626' },
              { label: 'Suspendidos', valor: stats.suspendidos, bg: '#EDE9FE', color: '#7C3AED' },
              { label: 'Recaudado', valor: `RD$${stats.recaudado.toLocaleString()}`, bg: '#D1FAE5', color: '#065F46' },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: s.bg, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>{s.valor}</div>
                <div style={{ color: s.color, fontSize: '11px', fontWeight: '600', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[
              { id: 'pendientes', label: `📋 Pendientes (${stats.pendientes})` },
              { id: 'usuarios', label: `👥 Usuarios (${stats.usuarios})` },
              { id: 'directorio', label: `📍 Directorio (${adminDirectorio.length})` },
              { id: 'reportes', label: `⚠️ Reportes (${stats.reportes})` },
              { id: 'precios', label: '💰 Precios' },
            ].map(t => (
              <button key={t.id} onClick={() => setTabActiva(t.id)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', backgroundColor: tabActiva === t.id ? '#1A3C5E' : '#F3F4F6', color: tabActiva === t.id ? 'white' : '#6B7280' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab: Pendientes */}
          {tabActiva === 'pendientes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {adminPublicaciones.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#F9FAFB', borderRadius: '12px', color: '#9CA3AF' }}>✅ No hay publicaciones pendientes</div>
              ) : adminPublicaciones.map((pub) => (
                <div key={pub.id} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#E5E7EB', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                      {pub.foto_url ? <img src={pub.foto_url} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🐷'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>Pendiente</span>
                        <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>{pub.tipo_animal}</span>
                      </div>
                      <p style={{ fontWeight: '700', color: '#1D4ED8', fontSize: '18px', margin: '0 0 4px 0' }}>RD$ {pub.precio?.toLocaleString()}</p>
                      <p style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 2px 0' }}>📍 {pub.provincia} — {pub.peso} lbs</p>
                      <p style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 2px 0' }}>👤 {pub.perfiles?.nombre}</p>
                      <p style={{ color: '#374151', fontSize: '13px', margin: 0 }}>{pub.descripcion}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '110px' }}>
                    <button onClick={() => cambiarEstadoPub(pub.id, 'aprobada')} style={{ backgroundColor: '#10B981', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>✓ Aprobar</button>
                    <button onClick={() => cambiarEstadoPub(pub.id, 'rechazada')} style={{ backgroundColor: '#F59E0B', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>✕ Rechazar</button>
                    <button onClick={() => eliminarPub(pub.id)} style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🗑 Eliminar</button>
                    <button onClick={() => cambiarEstadoPub(pub.id, 'vendida')} style={{ backgroundColor: '#6366F1', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Vendida</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Usuarios */}
          {tabActiva === 'usuarios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {adminUsuarios.map((u) => (
                <div key={u.id} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1A3C5E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', overflow: 'hidden', flexShrink: 0 }}>
                      {u.foto_perfil ? <img src={u.foto_perfil} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', color: '#111827', fontSize: '14px', margin: '0 0 2px 0' }}>{u.nombre}</p>
                      <p style={{ color: '#6B7280', fontSize: '12px', margin: '0 0 2px 0' }}>{u.tipo} — {u.provincia}</p>
                      <span style={{ backgroundColor: u.estado === 'suspendido' ? '#FEE2E2' : u.estado === 'verificado' ? '#D1FAE5' : '#F3F4F6', color: u.estado === 'suspendido' ? '#DC2626' : u.estado === 'verificado' ? '#065F46' : '#6B7280', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                        {u.estado || 'activo'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {u.estado !== 'verificado' && <button onClick={() => verificarUsuario(u.id)} style={{ backgroundColor: '#10B981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>✓ Verificar</button>}
                    {u.estado === 'suspendido'
                      ? <button onClick={() => activarUsuario(u.id)} style={{ backgroundColor: '#2563A8', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Activar</button>
                      : <button onClick={() => suspenderUsuario(u.id)} style={{ backgroundColor: '#F59E0B', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Suspender</button>
                    }
                    <button onClick={() => eliminarUsuario(u.id)} style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Directorio */}
          {tabActiva === 'directorio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {adminDirectorio.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#F9FAFB', borderRadius: '12px', color: '#9CA3AF' }}>No hay negocios en el directorio</div>
              ) : adminDirectorio.map((neg) => (
                <div key={neg.id} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>{neg.nombre}</p>
                    <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>{neg.categoria} — {neg.provincia}</p>
                  </div>
                  <button onClick={() => eliminarNegocio(neg.id)} style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>🗑 Eliminar</button>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Reportes */}
          {tabActiva === 'reportes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {adminReportes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#F9FAFB', borderRadius: '12px', color: '#9CA3AF' }}>No hay reportes</div>
              ) : adminReportes.map((r) => (
                <div key={r.id} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>⚠️ {r.motivo}</p>
                    {r.descripcion && <p style={{ color: '#374151', fontSize: '13px', margin: '0 0 6px 0' }}>{r.descripcion}</p>}
                    <span style={{ backgroundColor: r.resuelto ? '#D1FAE5' : '#FEE2E2', color: r.resuelto ? '#065F46' : '#DC2626', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                      {r.resuelto ? '✅ Resuelto' : '🔴 Pendiente'}
                    </span>
                  </div>
                  {!r.resuelto && <button onClick={() => resolverReporte(r.id)} style={{ backgroundColor: '#10B981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Resolver</button>}
                </div>
              ))}
            </div>
          )}

          {/* Tab: Precios */}
          {tabActiva === 'precios' && (
            <div>
              {editandoPrecio && (
                <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                  <h3 style={{ color: '#1A3C5E', margin: '0 0 12px 0', fontWeight: '700' }}>Editando: {editandoPrecio.provincia}</h3>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#374151' }}>Precio/Libra (RD$)</label>
                      <input type="number" value={nuevoPrecioLibra} onChange={(e) => setNuevoPrecioLibra(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', width: '150px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#374151' }}>Precio/Kilo (RD$)</label>
                      <input type="number" value={nuevoPrecioKilo} onChange={(e) => setNuevoPrecioKilo(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', width: '150px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={guardarPrecio} style={{ backgroundColor: '#10B981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>✓ Guardar</button>
                    <button onClick={() => setEditandoPrecio(null)} style={{ backgroundColor: '#6B7280', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Cancelar</button>
                  </div>
                </div>
              )}
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1A3C5E', color: 'white' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Provincia</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px' }}>Precio/Libra</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px' }}>Precio/Kilo</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {adminPrecios.map((p, i) => (
                    <tr key={p.id} style={{ backgroundColor: i % 2 === 0 ? '#F9FAFB' : 'white', borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '600', color: '#111827' }}>{p.provincia}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#1D4ED8', fontWeight: '700' }}>RD$ {p.precio_libra}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#1D4ED8', fontWeight: '700' }}>RD$ {p.precio_kilo}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button onClick={() => { setEditandoPrecio(p); setNuevoPrecioLibra(p.precio_libra); setNuevoPrecioKilo(p.precio_kilo) }}
                          style={{ backgroundColor: '#1A3C5E', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Mis publicaciones */}
      <h2 style={{ color: '#1A3C5E', marginBottom: '16px', fontWeight: '700', fontSize: '18px' }}>Mis Publicaciones ({publicaciones.length})</h2>
      {publicaciones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
          <p style={{ color: '#9CA3AF', marginBottom: '12px' }}>No tienes publicaciones todavía</p>
          <Link href="/publicar" style={{ color: '#2563A8', fontWeight: '700', textDecoration: 'none' }}>+ Crear publicación</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {publicaciones.map((pub) => (
            <div key={pub.id} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {pub.foto_url && <img src={pub.foto_url} alt="foto" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />}
                <div>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginRight: '8px' }}>{pub.tipo_animal}</span>
                  <span style={{ color: '#1D4ED8', fontWeight: '700', fontSize: '16px' }}>RD$ {pub.precio?.toLocaleString()}</span>
                  <p style={{ color: '#6B7280', fontSize: '13px', margin: '4px 0 0 0' }}>📍 {pub.provincia} — {pub.peso} lbs</p>
                  <p style={{ color: '#6B7280', fontSize: '12px', margin: '2px 0 0 0' }}>{pub.descripcion}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                <span style={{ backgroundColor: pub.estado === 'aprobada' ? '#D1FAE5' : pub.estado === 'rechazada' ? '#FEE2E2' : pub.estado === 'vendida' ? '#EDE9FE' : '#FEF3C7', color: pub.estado === 'aprobada' ? '#065F46' : pub.estado === 'rechazada' ? '#DC2626' : pub.estado === 'vendida' ? '#6D28D9' : '#D97706', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {pub.estado || 'pendiente'}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {pub.estado === 'aprobada' && (
                    <button onClick={() => marcarVendido(pub.id)} style={{ backgroundColor: '#D1FAE5', color: '#065F46', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Vendido</button>
                  )}
                  <button onClick={() => eliminarMiPublicacion(pub.id)} style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Aviso seguridad */}
      <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '16px', marginTop: '24px' }}>
        <p style={{ color: '#374151', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
          ℹ️ <strong>Aviso de Seguridad:</strong> Porcicultores RD no se hace responsable de tratos realizados fuera de la plataforma. Verifica siempre la identidad del comprador o vendedor antes de hacer una transacción.
        </p>
      </div>

      {/* Cerrar sesión */}
      <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
        style={{ display: 'block', width: '100%', padding: '14px', backgroundColor: 'transparent', color: '#EF4444', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', marginTop: '20px', textAlign: 'center' }}>
        Cerrar Sesión
      </button>
    </div>
  )
}