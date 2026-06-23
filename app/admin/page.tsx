'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Admin() {
  const [tab, setTab] = useState('pendientes')
  const [pendientes, setPendientes] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [reportes, setReportes] = useState<any[]>([])
  const [apoyos, setApoyos] = useState<any[]>([])
  const [precios, setPrecios] = useState<any[]>([])
  const [editandoPrecio, setEditandoPrecio] = useState<any>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const [{ data: pend }, { data: u }, { data: r }, { data: a }, { data: p }] = await Promise.all([
      supabase.from('publicaciones').select('*, perfiles(nombre, provincia)').eq('estado', 'pendiente').order('created_at', { ascending: false }),
      supabase.from('perfiles').select('*').order('created_at', { ascending: false }),
      supabase.from('reportes').select('*, reportado_por:perfiles!reportes_reportado_por_fkey(nombre), usuario_reportado:perfiles!reportes_usuario_reportado_fkey(nombre)').order('created_at', { ascending: false }),
      supabase.from('apoyos').select('*').order('created_at', { ascending: false }),
      supabase.from('precios_cerdo').select('*').order('provincia'),
    ])
    setPendientes(pend || [])
    setUsuarios(u || [])
    setReportes(r || [])
    setApoyos(a || [])
    setPrecios(p || [])
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

  const eliminarPublicacionAdmin = async (id: string) => {
    await supabase.from('publicaciones').delete().eq('id', id)
    cargarDatos()
  }

  const marcarVendidaAdmin = async (id: string) => {
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

  const totalRecaudado = apoyos.reduce((sum, a) => sum + (a.monto || 0), 0)

  if (cargando) return <p style={{ padding: '40px', fontFamily: 'sans-serif' }}>Cargando panel...</p>

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '800' }}>Panel de Administracion</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Moderacion y control de la plataforma</p>
        </div>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px' }}>Volver al inicio</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Pendientes', valor: pendientes.length, color: '#fef9c3', border: '#fcd34d' },
          { label: 'Usuarios', valor: usuarios.length, color: '#e0f2fe', border: '#7dd3fc' },
          { label: 'Reportes', valor: reportes.filter(r => !r.resuelto).length, color: '#fee2e2', border: '#fca5a5' },
          { label: 'Suspendidos', valor: usuarios.filter(u => u.estado === 'suspendido').length, color: '#f3e8ff', border: '#d8b4fe' },
          { label: 'Recaudado', valor: `RD$ ${totalRecaudado.toLocaleString()}`, color: '#dcfce7', border: '#86efac' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: s.color, border: `1px solid ${s.border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#0a2463' }}>{s.valor}</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        {[
          { id: 'pendientes', label: `Pendientes (${pendientes.length})` },
          { id: 'usuarios', label: `Usuarios (${usuarios.length})` },
          { id: 'reportes', label: `Reportes (${reportes.filter(r => !r.resuelto).length})` },
          { id: 'apoyos', label: `Apoyos (${apoyos.length})` },
          { id: 'precios', label: `Precios` },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px', backgroundColor: tab === t.id ? '#0a2463' : '#f1f5f9', color: tab === t.id ? 'white' : '#64748b' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'pendientes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pendientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              No hay publicaciones pendientes
            </div>
          ) : pendientes.map((pub) => (
            <div key={pub.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                {pub.foto_url && <img src={pub.foto_url} alt="foto" style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ backgroundColor: '#fef9c3', color: '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Pendiente</span>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>{pub.tipo_animal}</span>
                </div>
                <p style={{ fontWeight: '700', color: '#0a2463', marginBottom: '4px', fontSize: '16px' }}>RD$ {pub.precio?.toLocaleString()}</p>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Provincia: {pub.provincia} — Peso: {pub.peso} lbs</p>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>Vendedor: {pub.perfiles?.nombre}</p>
                <p style={{ color: '#475569', fontSize: '14px', marginTop: '8px' }}>{pub.descripcion}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                <button onClick={() => aprobarPublicacion(pub.id)} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>Aprobar</button>
                <button onClick={() => rechazarPublicacion(pub.id)} style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>Rechazar</button>
                <button onClick={() => eliminarPublicacionAdmin(pub.id)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'usuarios' && (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <thead>
            <tr style={{ backgroundColor: '#0a2463', color: 'white' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Nombre</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Tipo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Provincia</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Estado</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Accion</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => (
              <tr key={u.id} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600', fontSize: '14px' }}>{u.nombre}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{u.tipo}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{u.provincia}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ backgroundColor: u.estado === 'suspendido' ? '#fee2e2' : '#dcfce7', color: u.estado === 'suspendido' ? '#dc2626' : '#16a34a', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    {u.estado || 'activo'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {u.estado === 'suspendido' ? (
                    <button onClick={() => activarUsuario(u.id)} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Activar</button>
                  ) : (
                    <button onClick={() => suspenderUsuario(u.id)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Suspender</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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

      {tab === 'apoyos' && (
        <div>
          <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>Total Recaudado</p>
            <p style={{ color: '#16a34a', fontSize: '32px', fontWeight: '900' }}>RD$ {totalRecaudado.toLocaleString()}</p>
            <p style={{ color: '#64748b', fontSize: '13px' }}>{apoyos.length} contribuciones recibidas</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {apoyos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>No hay apoyos todavia</div>
            ) : apoyos.map((a) => (
              <div key={a.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '700', color: '#16a34a', fontSize: '18px', marginBottom: '4px' }}>RD$ {a.monto?.toLocaleString()}</p>
                  {a.mensaje && <p style={{ color: '#475569', fontSize: '14px' }}>{a.mensaje}</p>}
                  <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>{a.created_at?.slice(0, 10)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'precios' && (
        <div>
          <h2 style={{ color: '#0a2463', fontWeight: '800', marginBottom: '16px' }}>Editar Precios del Mercado</h2>
          {editandoPrecio && (
            <div style={{ backgroundColor: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ color: '#0a2463', marginBottom: '12px', fontWeight: '700' }}>Editando: {editandoPrecio.provincia}</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
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