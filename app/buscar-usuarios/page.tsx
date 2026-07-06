'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = [
  'Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional',
  'Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor',
  'Hermanas Mirabal','Independencia','La Altagracia','La Romana',
  'La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi',
  'Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná',
  'San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís',
  'Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde'
]

export default function Admin() {
  const [tab, setTab] = useState('estadisticas')
  const [pendientes, setPendientes] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [reportes, setReportes] = useState<any[]>([])
  const [apoyos, setApoyos] = useState<any[]>([])
  const [precios, setPrecios] = useState<any[]>([])
  const [directorio, setDirectorio] = useState<any[]>([])
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [contactos, setContactos] = useState<any[]>([])
  const [todasPublicaciones, setTodasPublicaciones] = useState<any[]>([])
  const [editandoPrecio, setEditandoPrecio] = useState<any>(null)
  const [nuevoNegocio, setNuevoNegocio] = useState(false)
  const [negocioForm, setNegocioForm] = useState({ nombre: '', categoria: 'veterinaria', provincia: '', telefono: '', whatsapp: '', direccion: '', descripcion: '', verificado: true })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const [{ data: pend }, { data: u }, { data: r }, { data: a }, { data: p }, { data: dir }, { data: sol }, { data: todas }] = await Promise.all([
      supabase.from('publicaciones').select('*, perfiles(nombre, provincia)').eq('estado', 'pendiente').order('created_at', { ascending: false }),
      supabase.from('perfiles').select('*').order('created_at', { ascending: false }),
      supabase.from('reportes').select('*, reportado_por:perfiles!reportes_reportado_por_fkey(nombre), usuario_reportado:perfiles!reportes_usuario_reportado_fkey(nombre)').order('created_at', { ascending: false }),
      supabase.from('apoyos').select('*').order('created_at', { ascending: false }),
      supabase.from('precios_cerdo').select('*').order('provincia'),
      supabase.from('directorio').select('*').order('nombre'),
      supabase.from('solicitudes_compra').select('*, perfiles(nombre, provincia, whatsapp)').order('created_at', { ascending: false }),
      supabase.from('publicaciones').select('*').order('created_at', { ascending: false }),
    ])
    setPendientes(pend || [])
    setUsuarios(u || [])
    setReportes(r || [])
    setApoyos(a || [])
    setPrecios(p || [])
    setDirectorio(dir || [])
    setSolicitudes(sol || [])
    setTodasPublicaciones(todas || [])
    setCargando(false)
  }

  const aprobarPublicacion = async (id: string) => {
    await supabase.from('publicaciones').update({ estado: 'aprobada', activo: true }).eq('id', id)
    cargarDatos()
  }

  const rechazarPublicacion = async (id: string) => {
    await supabase.from('publicaciones').update({ estado: 'rechazada', activo: false }).eq('id', id)
    cargarDatos()
  }

  const eliminarPublicacion = async (id: string) => {
    await supabase.from('publicaciones').delete().eq('id', id)
    cargarDatos()
  }

  const marcarVendida = async (id: string) => {
    await supabase.from('publicaciones').update({ estado: 'vendida', activo: false }).eq('id', id)
    cargarDatos()
  }

  const suspenderUsuario = async (id: string) => {
    await supabase.from('perfiles').update({ estado: 'suspendido' }).eq('id', id)
    cargarDatos()
  }

  const activarUsuario = async (id: string) => {
    await supabase.from('perfiles').update({ estado: 'activo' }).eq('id', id)
    cargarDatos()
  }

  const verificarUsuario = async (id: string) => {
    await supabase.from('perfiles').update({ estado: 'verificado', verificado: true }).eq('id', id)
    cargarDatos()
  }

  const eliminarUsuario = async (id: string) => {
    await supabase.from('perfiles').delete().eq('id', id)
    cargarDatos()
  }

  const resolverReporte = async (id: string) => {
    await supabase.from('reportes').update({ resuelto: true }).eq('id', id)
    cargarDatos()
  }

  const guardarPrecio = async () => {
    if (!editandoPrecio) return
    await supabase.from('precios_cerdo').update({
      precio_libra: parseFloat(editandoPrecio.precio_libra),
      precio_kilo: parseFloat(editandoPrecio.precio_kilo),
      fecha: new Date().toISOString().slice(0, 10)
    }).eq('id', editandoPrecio.id)
    setEditandoPrecio(null)
    cargarDatos()
  }

  const agregarNegocio = async () => {
    if (!negocioForm.nombre || !negocioForm.provincia) return
    await supabase.from('directorio').insert(negocioForm)
    setNuevoNegocio(false)
    setNegocioForm({ nombre: '', categoria: 'veterinaria', provincia: '', telefono: '', whatsapp: '', direccion: '', descripcion: '', verificado: true })
    cargarDatos()
  }

  const eliminarNegocio = async (id: string) => {
    await supabase.from('directorio').delete().eq('id', id)
    cargarDatos()
  }

  const verificarNegocio = async (id: string) => {
    await supabase.from('directorio').update({ verificado: true }).eq('id', id)
    cargarDatos()
  }

  const eliminarSolicitud = async (id: string) => {
    await supabase.from('solicitudes_compra').delete().eq('id', id)
    cargarDatos()
  }

  const totalRecaudado = apoyos.reduce((sum, a) => sum + (a.monto || 0), 0)
  const pubAprobadas = todasPublicaciones.filter(p => p.estado === 'aprobada').length
  const pubRechazadas = todasPublicaciones.filter(p => p.estado === 'rechazada').length
  const pubVendidas = todasPublicaciones.filter(p => p.estado === 'vendida').length

  if (cargando) return <p style={{ padding: '40px', fontFamily: 'sans-serif' }}>Cargando panel...</p>

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '800' }}>Panel de Administracion</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Moderacion y control de Porcicultores RD</p>
        </div>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Volver al inicio</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Usuarios', valor: usuarios.length, color: '#e0f2fe', border: '#7dd3fc' },
          { label: 'Pendientes', valor: pendientes.length, color: '#fef9c3', border: '#fcd34d' },
          { label: 'Aprobadas', valor: pubAprobadas, color: '#dcfce7', border: '#86efac' },
          { label: 'Vendidas', valor: pubVendidas, color: '#e0e7ff', border: '#a5b4fc' },
          { label: 'Rechazadas', valor: pubRechazadas, color: '#fee2e2', border: '#fca5a5' },
          { label: 'Reportes', valor: reportes.filter(r => !r.resuelto).length, color: '#fef3c7', border: '#fcd34d' },
          { label: 'Directorio', valor: directorio.length, color: '#f0fdf4', border: '#86efac' },
          { label: 'Recaudado', valor: `RD$ ${totalRecaudado.toLocaleString()}`, color: '#dcfce7', border: '#86efac' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: s.color, border: `1px solid ${s.border}`, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#0a2463' }}>{s.valor}</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        {[
          { id: 'estadisticas', label: 'Estadisticas' },
          { id: 'pendientes', label: `Pendientes (${pendientes.length})` },
          { id: 'usuarios', label: `Usuarios (${usuarios.length})` },
          { id: 'directorio', label: `Directorio (${directorio.length})` },
          { id: 'solicitudes', label: `Compras (${solicitudes.length})` },
          { id: 'reportes', label: `Reportes (${reportes.filter(r => !r.resuelto).length})` },
          { id: 'apoyos', label: `Apoyos (${apoyos.length})` },
          { id: 'precios', label: 'Precios' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '13px', backgroundColor: tab === t.id ? '#0a2463' : '#f1f5f9', color: tab === t.id ? 'white' : '#64748b' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Estadisticas */}
      {tab === 'estadisticas' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { titulo: 'Total Publicaciones', valor: todasPublicaciones.length, desc: `${pubAprobadas} aprobadas, ${pendientes.length} pendientes, ${pubRechazadas} rechazadas, ${pubVendidas} vendidas` },
            { titulo: 'Total Usuarios', valor: usuarios.length, desc: `${usuarios.filter(u => u.estado === 'verificado').length} verificados, ${usuarios.filter(u => u.estado === 'suspendido').length} suspendidos` },
            { titulo: 'Directorio', valor: directorio.length, desc: `${directorio.filter(d => d.verificado).length} negocios verificados` },
            { titulo: 'Solicitudes de Compra', valor: solicitudes.length, desc: `${solicitudes.filter(s => s.activo).length} activas` },
            { titulo: 'Reportes', valor: reportes.length, desc: `${reportes.filter(r => !r.resuelto).length} pendientes de revision` },
            { titulo: 'Total Recaudado', valor: `RD$ ${totalRecaudado.toLocaleString()}`, desc: `${apoyos.length} contribuciones recibidas` },
          ].map(s => (
            <div key={s.titulo} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ color: '#0a2463', fontWeight: '800', marginBottom: '8px', fontSize: '16px' }}>{s.titulo}</h3>
              <p style={{ color: '#0a2463', fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>{s.valor}</p>
              <p style={{ color: '#64748b', fontSize: '13px' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pendientes */}
      {tab === 'pendientes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pendientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>No hay publicaciones pendientes</div>
          ) : pendientes.map((pub) => (
            <div key={pub.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                {pub.foto_url && <img src={pub.foto_url} alt="foto" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ backgroundColor: '#fef9c3', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Pendiente</span>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>{pub.tipo_animal}</span>
                </div>
                <p style={{ fontWeight: '700', color: '#0a2463', fontSize: '16px', marginBottom: '4px' }}>RD$ {pub.precio?.toLocaleString()}</p>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Provincia: {pub.provincia} — Peso: {pub.peso} lbs</p>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Vendedor: {pub.perfiles?.nombre}</p>
                <p style={{ color: '#475569', fontSize: '14px', marginTop: '8px' }}>{pub.descripcion}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                <button onClick={() => aprobarPublicacion(pub.id)} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Aprobar</button>
                <button onClick={() => rechazarPublicacion(pub.id)} style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Rechazar</button>
                <button onClick={() => eliminarPublicacion(pub.id)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Eliminar</button>
                <button onClick={() => marcarVendida(pub.id)} style={{ backgroundColor: '#4338ca', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Vendida</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Usuarios */}
      {tab === 'usuarios' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {usuarios.map((u) => (
            <div key={u.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#0a2463', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', overflow: 'hidden', flexShrink: 0 }}>
                  {u.foto_perfil ? <img src={u.foto_perfil} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.nombre?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: '700', color: '#0a2463', fontSize: '14px', marginBottom: '2px' }}>{u.nombre}</p>
                  <p style={{ color: '#64748b', fontSize: '12px' }}>{u.tipo} — {u.provincia}</p>
                  <span style={{ backgroundColor: u.estado === 'suspendido' ? '#fee2e2' : u.estado === 'verificado' ? '#dcfce7' : '#f1f5f9', color: u.estado === 'suspendido' ? '#dc2626' : u.estado === 'verificado' ? '#16a34a' : '#64748b', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                    {u.estado || 'activo'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {u.estado !== 'verificado' && (
                  <button onClick={() => verificarUsuario(u.id)} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Verificar</button>
                )}
                {u.estado === 'suspendido' ? (
                  <button onClick={() => activarUsuario(u.id)} style={{ backgroundColor: '#0a2463', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Activar</button>
                ) : (
                  <button onClick={() => suspenderUsuario(u.id)} style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Suspender</button>
                )}
                <button onClick={() => { if(confirm('Eliminar usuario permanentemente?')) eliminarUsuario(u.id) }} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Directorio */}
      {tab === 'directorio' && (
        <div>
          <button onClick={() => setNuevoNegocio(!nuevoNegocio)}
            style={{ backgroundColor: '#0a2463', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', marginBottom: '20px' }}>
            {nuevoNegocio ? 'Cancelar' : 'Agregar Negocio'}
          </button>

          {nuevoNegocio && (
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ color: '#0a2463', marginBottom: '16px', fontWeight: '700' }}>Nuevo Negocio</h3>
              <input placeholder="Nombre del negocio *" value={negocioForm.nombre} onChange={(e) => setNegocioForm({...negocioForm, nombre: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
              <select value={negocioForm.categoria} onChange={(e) => setNegocioForm({...negocioForm, categoria: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}>
                <option value="veterinaria">Veterinaria</option>
                <option value="farmacia_veterinaria">Farmacia Veterinaria</option>
                <option value="tienda_alimento">Tienda de Alimento</option>
                <option value="transportista">Transportista</option>
                <option value="servicio_porcino">Servicio Porcino</option>
              </select>
              <select value={negocioForm.provincia} onChange={(e) => setNegocioForm({...negocioForm, provincia: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}>
                <option value="">Selecciona provincia *</option>
                {provincias.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input placeholder="Telefono" value={negocioForm.telefono} onChange={(e) => setNegocioForm({...negocioForm, telefono: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
              <input placeholder="WhatsApp" value={negocioForm.whatsapp} onChange={(e) => setNegocioForm({...negocioForm, whatsapp: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
              <input placeholder="Direccion" value={negocioForm.direccion} onChange={(e) => setNegocioForm({...negocioForm, direccion: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
              <textarea placeholder="Descripcion" value={negocioForm.descripcion} onChange={(e) => setNegocioForm({...negocioForm, descripcion: e.target.value})} rows={3}
                style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
              <button onClick={agregarNegocio}
                style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                Guardar Negocio
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {directorio.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>No hay negocios en el directorio</div>
            ) : directorio.map((neg) => (
              <div key={neg.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontWeight: '700', color: '#0a2463', fontSize: '15px', marginBottom: '4px' }}>{neg.nombre}</p>
                  <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>{neg.categoria} — {neg.provincia}</p>
                  {neg.telefono && <p style={{ color: '#64748b', fontSize: '13px' }}>Tel: {neg.telefono}</p>}
                  <span style={{ backgroundColor: neg.verificado ? '#dcfce7' : '#fef9c3', color: neg.verificado ? '#16a34a' : '#92400e', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                    {neg.verificado ? 'Verificado' : 'Sin verificar'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {!neg.verificado && (
                    <button onClick={() => verificarNegocio(neg.id)} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Verificar</button>
                  )}
                  <button onClick={() => eliminarNegocio(neg.id)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Solicitudes de Compra */}
      {tab === 'solicitudes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {solicitudes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>No hay solicitudes de compra</div>
          ) : solicitudes.map((sol) => (
            <div key={sol.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div>
                <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '8px', display: 'inline-block' }}>Busco: {sol.tipo_animal}</span>
                <p style={{ color: '#1e293b', fontSize: '14px', marginBottom: '4px' }}>{sol.descripcion}</p>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Cantidad: {sol.cantidad} — Provincia: {sol.provincia}</p>
                {sol.presupuesto && <p style={{ color: '#16a34a', fontSize: '13px', fontWeight: '700' }}>Presupuesto: RD$ {sol.presupuesto?.toLocaleString()}</p>}
                <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Usuario: {sol.perfiles?.nombre}</p>
              </div>
              <button onClick={() => eliminarSolicitud(sol.id)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Eliminar</button>
            </div>
          ))}
        </div>
      )}

      {/* Reportes */}
      {tab === 'reportes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reportes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>No hay reportes</div>
          ) : reportes.map((r) => (
            <div key={r.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '700', color: '#0a2463', marginBottom: '4px' }}>Reportado: {r.usuario_reportado?.nombre}</p>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Por: {r.reportado_por?.nombre}</p>
                <p style={{ color: '#64748b', fontSize: '13px' }}>Motivo: {r.motivo}</p>
                {r.descripcion && <p style={{ color: '#475569', fontSize: '13px', marginTop: '4px' }}>{r.descripcion}</p>}
              </div>
              <div>
                <span style={{ backgroundColor: r.resuelto ? '#dcfce7' : '#fee2e2', color: r.resuelto ? '#16a34a' : '#dc2626', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px', textAlign: 'center' }}>
                  {r.resuelto ? 'Resuelto' : 'Pendiente'}
                </span>
                {!r.resuelto && <button onClick={() => resolverReporte(r.id)} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Resolver</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apoyos */}
      {tab === 'apoyos' && (
        <div>
          <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>Total Recaudado</p>
            <p style={{ color: '#16a34a', fontSize: '36px', fontWeight: '900' }}>RD$ {totalRecaudado.toLocaleString()}</p>
            <p style={{ color: '#64748b', fontSize: '13px' }}>{apoyos.length} contribuciones recibidas</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {apoyos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>No hay apoyos todavia</div>
            ) : apoyos.map((a) => (
              <div key={a.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <p style={{ fontWeight: '700', color: '#16a34a', fontSize: '20px', marginBottom: '4px' }}>RD$ {a.monto?.toLocaleString()}</p>
                {a.mensaje && <p style={{ color: '#475569', fontSize: '14px', marginBottom: '4px' }}>{a.mensaje}</p>}
                <p style={{ color: '#94a3b8', fontSize: '12px' }}>{a.created_at?.slice(0, 10)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Precios */}
      {tab === 'precios' && (
        <div>
          <h2 style={{ color: '#0a2463', fontWeight: '800', marginBottom: '16px' }}>Editar Precios del Mercado</h2>
          {editandoPrecio && (
            <div style={{ backgroundColor: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ color: '#0a2463', marginBottom: '12px', fontWeight: '700' }}>Editando: {editandoPrecio.provincia}</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Precio por Libra (RD$)</label>
                  <input type="number" value={editandoPrecio.precio_libra} onChange={(e) => setEditandoPrecio({ ...editandoPrecio, precio_libra: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', width: '160px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Precio por Kilo (RD$)</label>
                  <input type="number" value={editandoPrecio.precio_kilo} onChange={(e) => setEditandoPrecio({ ...editandoPrecio, precio_kilo: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', width: '160px' }} />
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
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px' }}>Fecha</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px' }}>Editar</th>
              </tr>
            </thead>
            <tbody>
              {precios.map((p, i) => (
                <tr key={p.id} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0a2463' }}>{p.provincia}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: '#16a34a', fontWeight: '700' }}>RD$ {p.precio_libra}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: '#16a34a', fontWeight: '700' }}>RD$ {p.precio_kilo}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8', fontSize: '12px' }}>{p.fecha}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button onClick={() => setEditandoPrecio(p)} style={{ backgroundColor: '#0a2463', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}