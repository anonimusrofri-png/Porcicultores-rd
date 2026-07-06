'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function PanelAdmin() {
  const [cargando, setCargando] = useState(true)
  const [pestana, setPestana] = useState<'pendientes' | 'usuarios' | 'reportes' | 'apoyos' | 'precios'>('pendientes')
  
  // Estados de datos
  const [publicaciones, setPublicaciones] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [reportes, setReportes] = useState<any[]>([])
  const [apoyos, setApoyos] = useState<any[]>([])
  const [precios, setPrecios] = useState<any[]>([])

  // Estados para agregar/editar precios
  const [nuevaProvincia, setNuevaProvincia] = useState('')
  const [precioLibra, setPrecioLibra] = useState('')
  const [precioKilo, setPrecioKilo] = useState('')
  const [provinciaEditando, setProvinciaEditando] = useState<string | null>(null)

  // Estados para editar publicaciones
  const [pubEditandoId, setPubEditandoId] = useState<string | null>(null)
  const [nuevoAnimalPub, setNuevoAnimalPub] = useState('')
  const [nuevoPrecioPub, setNuevoPrecioPub] = useState('')
  const [nuevoPesoPub, setNuevoPesoPub] = useState('')

  useEffect(() => {
    validarYCargar()
  }, [])

  const validarYCargar = async () => {
    setCargando(true)
    
    // 1. Verificar sesión de usuario
    const { data: { user } } = await supabase.auth.getUser()
    
    // 2. Bloqueo estricto por tu correo de administrador
    if (!user || user.email !== 'anonimusrofri@gmail.com') {
      window.location.href = '/'
      return
    }

    // 3. Bloqueo por tabla de administradores en la base de datos
    const { data: adminCheck, error: adminError } = await supabase
      .from('administradores')
      .select('id')
      .eq('id', user.id)
      .single()

    if (adminError || !adminCheck) {
      window.location.href = '/'
      return
    }

    // 4. Si pasa, cargar todos los datos de la plataforma
    await cargarTodosLosDatos()
    setCargando(false)
  }

  const cargarTodosLosDatos = async () => {
    const [pubRes, userRes, repRes, apoRes, preRes] = await Promise.all([
      supabase.from('publicaciones').select('*').order('created_at', { ascending: false }),
      supabase.from('perfiles').select('*').order('nombre', { ascending: true }),
      supabase.from('reportes').select('*').order('created_at', { ascending: false }),
      supabase.from('apoyos').select('*').order('created_at', { ascending: false }),
      supabase.from('precios_cerdo').select('*').order('provincia', { ascending: true })
    ])

    setPublicaciones(pubRes.data || [])
    setUsuarios(userRes.data || [])
    setReportes(repRes.data || [])
    setApoyos(apoRes.data || [])
    setPrecios(preRes.data || [])
  }

  // ACCIONES DE PUBLICACIONES
  const cambiarEstadoPublicacion = async (id: string, nuevoEstado: string) => {
    const { error } = await supabase
      .from('publicaciones')
      .update({ estado: nuevoEstado })
      .eq('id', id)

    if (!error) {
      alert(`Publicación marcada como ${nuevoEstado}`)
      cargarTodosLosDatos()
    }
  }

  const eliminarPublicacion = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta publicación permanentemente?')) return
    const { error } = await supabase.from('publicaciones').delete().eq('id', id)
    if (!error) {
      alert('Publicación eliminada')
      cargarTodosLosDatos()
    }
  }

  const guardarCambiosPublicacion = async (id: string) => {
    const { error } = await supabase
      .from('publicaciones')
      .update({
        tipo_animal: nuevoAnimalPub,
        precio: parseFloat(nuevoPrecioPub),
        peso: parseFloat(nuevoPesoPub)
      })
      .eq('id', id)

    if (!error) {
      alert('Publicación modificada con éxito')
      setPubEditandoId(null)
      cargarTodosLosDatos()
    }
  }

  // ACCIONES DE PRECIOS (UPSERT COMPLETO)
  const guardarPrecioProvincia = async (e: React.FormEvent) => {
    e.preventDefault()
    const prov = provinciaEditando || nuevaProvincia
    if (!prov || !precioLibra || !precioKilo) {
      alert('Por favor, completa todos los campos de precios')
      return
    }

    const { error } = await supabase
      .from('precios_cerdo')
      .upsert({
        provincia: prov.trim(),
        precio_libra: parseFloat(precioLibra),
        precio_kilo: parseFloat(precioKilo),
        fecha_actualizacion: new Date().toISOString().split('T')[0]
      }, { onConflict: 'provincia' })

    if (!error) {
      alert('Precio guardado correctamente')
      setNuevaProvincia('')
      setPrecioLibra('')
      setPrecioKilo('')
      setProvinciaEditando(null)
      cargarTodosLosDatos()
    }
  }

  // ACCIONES DE USUARIOS
  const cambiarVerificacionUsuario = async (id: string, estadoVerificado: boolean) => {
    const { error } = await supabase
      .from('perfiles')
      .update({ verificado: estadoVerificado })
      .eq('id', id)

    if (!error) {
      alert(estadoVerificado ? 'Usuario verificado (Check Azul)' : 'Verificación removida')
      cargarTodosLosDatos()
    }
  }

  const totalRecaudado = apoyos.reduce((acc, curr) => acc + (curr.monto || 0), 0)
  const publicacionesPendientes = publicaciones.filter(p => p.estado === 'pendiente' || !p.estado)

  if (cargando) return <p style={{ padding: '40px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Cargando panel de control seguro...</p>

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ color: '#c1121f', fontSize: '28px', fontWeight: '900', margin: 0 }}>Panel de Administración</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>Moderación y control absoluto de Porcicultores RD</p>
        </div>
        <Link href="/perfil" style={{ backgroundColor: '#0a2463', color: 'white', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Volver al perfil</Link>
      </div>

      {/* Tarjetas de Métricas Rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#fef9c3', padding: '16px', borderRadius: '12px', border: '1px solid #fef08a', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#a16207' }}>{publicacionesPendientes.length}</div>
          <div style={{ fontSize: '12px', color: '#713f12', fontWeight: '600', marginTop: '4px' }}>Pendientes</div>
        </div>
        <div style={{ backgroundColor: '#e0f2fe', padding: '16px', borderRadius: '12px', border: '1px solid #bae6fd', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0369a1' }}>{usuarios.length}</div>
          <div style={{ fontSize: '12px', color: '#075985', fontWeight: '600', marginTop: '4px' }}>Usuarios</div>
        </div>
        <div style={{ backgroundColor: '#fee2e2', padding: '16px', borderRadius: '12px', border: '1px solid #fecaca', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#dc2626' }}>{reportes.length}</div>
          <div style={{ fontSize: '12px', color: '#991b1b', fontWeight: '600', marginTop: '4px' }}>Reportes</div>
        </div>
        <div style={{ backgroundColor: '#dcfce7', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#16a34a' }}>RD$ {totalRecaudado.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#166534', fontWeight: '600', marginTop: '4px' }}>Recaudado</div>
        </div>
      </div>

      {/* Menú de pestañas internas */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        {(['pendientes', 'usuarios', 'precios', 'reportes', 'apoyos'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setPestana(t)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px',
              textTransform: 'capitalize',
              backgroundColor: pestana === t ? '#c1121f' : '#f1f5f9',
              color: pestana === t ? 'white' : '#475569'
            }}
          >
            {t === 'pendientes' ? `Pendientes (${publicacionesPendientes.length})` : t}
          </button>
        ))}
      </div>

      {/* CONTENIDO DE PESTAÑA: PENDIENTES */}
      {pestana === 'pendientes' && (
        <div>
          <h2 style={{ color: '#0a2463', fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Publicaciones en Espera de Moderación</h2>
          {publicacionesPendientes.length === 0 ? (
            <p style={{ color: '#64748b', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>No hay publicaciones pendientes de aprobación.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {publicacionesPendientes.map((pub) => (
                <div key={pub.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                  {pubEditandoId === pub.id ? (
                    /* MODO EDICIÓN DE PUBLICACIÓN */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <h4 style={{ margin: 0, color: '#c1121f' }}>Editar Datos de Publicación</h4>
                      <input type="text" value={nuevoAnimalPub} onChange={(e) => setNuevoAnimalPub(e.target.value)} placeholder="Tipo de animal (ej. Cerdo)" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                      <input type="number" value={nuevoPrecioPub} onChange={(e) => setNuevoPrecioPub(e.target.value)} placeholder="Precio (RD$)" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                      <input type="number" value={nuevoPesoPub} onChange={(e) => setNuevoPesoPub(e.target.value)} placeholder="Peso (lbs)" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => guardarCambiosPublicacion(pub.id)} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar</button>
                        <button onClick={() => setPubEditandoId(null)} style={{ backgroundColor: '#64748b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    /* MODO VISTA DE CONTROL */
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        {pub.foto_url && <img src={pub.foto_url} alt="cerdo" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />}
                        <div>
                          <span style={{ backgroundColor: '#fef9c3', color: '#854d0e', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>Pendiente</span>
                          <h3 style={{ margin: '4px 0', fontSize: '18px', fontWeight: '800', color: '#0a2463' }}>{pub.tipo_animal || 'Cerdo'} - <span style={{ color: '#16a34a' }}>RD$ {pub.precio?.toLocaleString()}</span></h3>
                          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Provincia: <strong>{pub.provincia}</strong> — Peso: <strong>{pub.peso} lbs</strong></p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>{pub.descripcion}</p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>ID Vendedor: {pub.usuario_id}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => cambiarEstadoPublicacion(pub.id, 'aprobada')} style={{ backgroundColor: '#dcfce7', color: '#16a34a', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Aprobar</button>
                        <button onClick={() => cambiarEstadoPublicacion(pub.id, 'rechazada')} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Rechazar</button>
                        <button onClick={() => {
                          setPubEditandoId(pub.id)
                          setNuevoAnimalPub(pub.tipo_animal || '')
                          setNuevoPrecioPub(pub.precio || '')
                          setNuevoPesoPub(pub.peso || '')
                        }} style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Editar</button>
                        <button onClick={() => eliminarPublicacion(pub.id)} style={{ backgroundColor: '#334155', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Eliminar</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO DE PESTAÑA: USUARIOS (CON VERIFICACIÓN) */}
      {pestana === 'usuarios' && (
        <div>
          <h2 style={{ color: '#0a2463', fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Gestión de Usuarios</h2>
          <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '12px 16px' }}>Nombre</th>
                  <th style={{ padding: '12px 16px' }}>Provincia</th>
                  <th style={{ padding: '12px 16px' }}>Tipo</th>
                  <th style={{ padding: '12px 16px' }}>Estado</th>
                  <th style={{ padding: '12px 16px' }}>Verificación</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>
                      {u.nombre || 'Sin nombre'}
                      {u.verificado && <span style={{ color: '#3b82f6', marginLeft: '4px' }} title="Verificado">✓</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{u.provincia || 'No especificada'}</td>
                    <td style={{ padding: '12px 16px', textTransform: 'uppercase', fontSize: '12px' }}>{u.tipo || 'comprador'}</td>
                    <td style={{ padding: '12px 16px' }}>{u.estado || 'activo'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {u.verificado ? (
                        <button onClick={() => cambiarVerificacionUsuario(u.id, false)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Quitar Check</button>
                      ) : (
                        <button onClick={() => cambiarVerificacionUsuario(u.id, true)} style={{ backgroundColor: '#e0f2fe', color: '#0369a1', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Verificar Vendedor</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTENIDO DE PESTAÑA: PRECIOS (AGREGAR NUEVOS Y EDITAR EXISTENTES) */}
      {pestana === 'precios' && (
        <div>
          <h2 style={{ color: '#0a2463', fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Precios del Mercado de Cerdos</h2>
          
          {/* Formulario unificado para Registrar nuevas provincias o actualizar existentes */}
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#c1121f', fontWeight: '700' }}>
              {provinciaEditando ? `Modificando Precio de: ${provinciaEditando}` : 'Agregar Nueva Provincia o Actualizar Existente'}
            </h3>
            <form onSubmit={guardarPrecioProvincia} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {!provinciaEditando && (
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Provincia</label>
                  <input type="text" value={nuevaProvincia} onChange={(e) => setNuevaProvincia(e.target.value)} placeholder="Ej: Monte Cristi" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
              )}
              <div style={{ width: '140px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Precio/Libra (RD$)</label>
                <input type="number" value={precioLibra} onChange={(e) => setPrecioLibra(e.target.value)} placeholder="140" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ width: '140px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Precio/Kilo (RD$)</label>
                <input type="number" value={precioKilo} onChange={(e) => setPrecioKilo(e.target.value)} placeholder="308" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>
                  {provinciaEditando ? 'Actualizar' : 'Registrar Provincia'}
                </button>
                {provinciaEditando && (
                  <button type="button" onClick={() => { setProvinciaEditando(null); setPrecioLibra(''); setPrecioKilo(''); }} style={{ backgroundColor: '#64748b', color: 'white', border: 'none', padding: '10px 14px', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
                )}
              </div>
            </form>
          </div>

          {/* Tabla de visualización de precios */}
          <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '12px 16px' }}>Provincia</th>
                  <th style={{ padding: '12px 16px' }}>Precio / Libra</th>
                  <th style={{ padding: '12px 16px' }}>Precio / Kilo</th>
                  <th style={{ padding: '12px 16px' }}>Última Actualización</th>
                  <th style={{ padding: '12px 16px' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {precios.map((p) => (
                  <tr key={p.provincia} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0a2463' }}>{p.provincia}</td>
                    <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: '600' }}>RD$ {p.precio_libra}</td>
                    <td style={{ padding: '12px 16px' }}>RD$ {p.precio_kilo}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{p.fecha_actualizacion || 'Reciente'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => {
                          setProvinciaEditando(p.provincia)
                          setPrecioLibra(p.precio_libra?.toString() || '')
                          setPrecioKilo(p.precio_kilo?.toString() || '')
                        }}
                        style={{ backgroundColor: '#f1f5f9', color: '#0a2463', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTENIDO DE PESTAÑA: REPORTES */}
      {pestana === 'reportes' && (
        <div>
          <h2 style={{ color: '#0a2463', fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Reportes de Usuarios</h2>
          {reportes.length === 0 ? (
            <p style={{ color: '#64748b', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>No hay reportes activos en la plataforma.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reportes.map((rep) => (
                <div key={rep.id} style={{ backgroundColor: 'white', border: '1px solid #fee2e2', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '14px' }}><strong>Motivo:</strong> {rep.motivo}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Reportado por: {rep.reportado_por} → Usuario Infractor: {rep.usuario_reportado}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO DE PESTAÑA: APOYOS */}
      {pestana === 'apoyos' && (
        <div>
          <h2 style={{ color: '#0a2463', fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Contribuciones y Apoyos Económicos</h2>
          {apoyos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
              <p style={{ color: '#94a3b8', margin: 0 }}>No se han registrado transacciones de apoyo todavía.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {apoyos.map((apo) => (
                <div key={apo.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ color: '#16a34a', fontWeight: '900' }}>RD$ {apo.monto}</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Usuario ID: {apo.usuario_id} — Fecha: {apo.created_at}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}