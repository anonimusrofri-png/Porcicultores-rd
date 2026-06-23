'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Perfil() {
  const [perfil, setPerfil] = useState<any>(null)
  const [publicaciones, setPublicaciones] = useState<any[]>([])
  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null)
  const [previstaFoto, setPrevistaFoto] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    cargarPerfil()
  }, [])

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
    setCargando(false)
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
    cargarPerfil()
    setGuardando(false)
  }

  const eliminarPublicacion = async (id: string) => {
    await supabase.from('publicaciones').delete().eq('id', id)
    cargarPerfil()
  }

  const marcarVendido = async (id: string) => {
    await supabase.from('publicaciones').update({ estado: 'vendida', activo: false }).eq('id', id)
    cargarPerfil()
  }

  if (cargando) return <p style={{ padding: '40px', fontFamily: 'sans-serif' }}>Cargando perfil...</p>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900' }}>Mi Perfil</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0a2463, #1565c0)', borderRadius: '20px', padding: '32px', marginBottom: '24px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div onClick={() => editando && document.getElementById('inputFotoPerfil')?.click()}
              style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '900', color: 'white', border: '3px solid rgba(255,255,255,0.4)', overflow: 'hidden', cursor: editando ? 'pointer' : 'default' }}>
              {previstaFoto ? (
                <img src={previstaFoto} alt="foto perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                perfil?.nombre?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900' }}>{perfil?.nombre}</h2>
              <p style={{ margin: '4px 0', opacity: 0.8, fontSize: '14px' }}>{perfil?.provincia}</p>
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                {[1,2,3,4,5].map(n => (
                  <span key={n} style={{ color: n <= Math.round(perfil?.estrellas || 0) ? '#fbbf24' : 'rgba(255,255,255,0.3)', fontSize: '16px' }}>★</span>
                ))}
                <span style={{ opacity: 0.7, fontSize: '13px', marginLeft: '4px' }}>({perfil?.estrellas || 0})</span>
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
            { label: 'Tipo', valor: perfil?.tipo },
            { label: 'Estado', valor: perfil?.estado || 'activo' },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>{s.valor}</div>
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
        <Link href="/chat" style={{ backgroundColor: '#f0f4f8', color: '#0a2463', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Mensajes Privados</Link>
        <Link href="/resena" style={{ backgroundColor: '#f0f4f8', color: '#0a2463', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Dejar Resena</Link>
      </div>

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
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginRight: '8px' }}>{pub.tipo_animal}</span>
                  <span style={{ color: '#16a34a', fontWeight: '900', fontSize: '16px' }}>RD$ {pub.precio?.toLocaleString()}</span>
                  <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{pub.provincia} — {pub.peso} lbs</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                <span style={{ backgroundColor: pub.estado === 'aprobada' ? '#dcfce7' : pub.estado === 'rechazada' ? '#fee2e2' : pub.estado === 'vendida' ? '#e0e7ff' : '#fef9c3', color: pub.estado === 'aprobada' ? '#16a34a' : pub.estado === 'rechazada' ? '#dc2626' : pub.estado === 'vendida' ? '#4338ca' : '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                  {pub.estado || 'pendiente'}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {pub.estado === 'aprobada' && (
                    <button onClick={() => marcarVendido(pub.id)}
                      style={{ backgroundColor: '#dcfce7', color: '#16a34a', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                      Marcar Vendido
                    </button>
                  )}
                  <button onClick={() => eliminarPublicacion(pub.id)}
                    style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}