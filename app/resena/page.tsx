'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Resena() {
  const [usuario, setUsuario] = useState<any>(null)
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null)
  const [mostrarLista, setMostrarLista] = useState(false)
  const [estrellas, setEstrellas] = useState(5)
  const [comentario, setComentario] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    setUsuario(user)
    const { data } = await supabase.from('perfiles').select('id, nombre, provincia').neq('id', user.id)
    setUsuarios(data || [])
  }

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const seleccionarUsuario = (u: any) => {
    setUsuarioSeleccionado(u)
    setBusqueda(u.nombre)
    setMostrarLista(false)
  }

  const handleEnviar = async () => {
    if (!usuarioSeleccionado) {
      setError('Selecciona un usuario para reseñar')
      return
    }
    setCargando(true)
    setError('')

    const { error: resenaError } = await supabase.from('resenas').insert({
      de_usuario: usuario.id,
      para_usuario: usuarioSeleccionado.id,
      estrellas,
      comentario,
    })

    if (resenaError) {
      setError('Error al enviar la reseña.')
      setCargando(false)
      return
    }

    const { data: resenas } = await supabase
      .from('resenas')
      .select('estrellas')
      .eq('para_usuario', usuarioSeleccionado.id)

    if (resenas) {
      const promedio = resenas.reduce((a, r) => a + r.estrellas, 0) / resenas.length
      await supabase.from('perfiles').update({
        estrellas: Math.round(promedio * 10) / 10,
        total_resenas: resenas.length
      }).eq('id', usuarioSeleccionado.id)
    }

    setEnviado(true)
    setCargando(false)
  }

  if (enviado) return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', border: '1px solid #ddd', borderRadius: '12px' }}>
      <p style={{ fontSize: '48px' }}>⭐</p>
      <h2 style={{ color: '#16a34a' }}>¡Reseña enviada!</h2>
      <p style={{ color: '#64748b' }}>Gracias por tu opinión.</p>
      <Link href="/" style={{ color: '#1a56db' }}>← Volver al inicio</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '40px', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#1a56db' }}>⭐ Dejar Reseña</h1>
        <Link href="/" style={{ color: '#1a56db', textDecoration: 'none' }}>← Inicio</Link>
      </div>

      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Buscar usuario *</label>
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <input
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setMostrarLista(true); setUsuarioSeleccionado(null) }}
          onFocus={() => setMostrarLista(true)}
          placeholder="Escribe el nombre del usuario..."
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
        {mostrarLista && busqueda && usuariosFiltrados.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', zIndex: 10, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {usuariosFiltrados.map(u => (
              <div key={u.id} onClick={() => seleccionarUsuario(u)}
                style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}>
                <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{u.nombre}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>📍 {u.provincia}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {usuarioSeleccionado && (
        <div style={{ backgroundColor: '#e8f4fd', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '14px', color: '#1a56db' }}>
          ✅ Seleccionado: <strong>{usuarioSeleccionado.nombre}</strong> — {usuarioSeleccionado.provincia}
        </div>
      )}

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Calificación *</label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setEstrellas(n)}
            style={{ fontSize: '32px', background: 'none', border: 'none', cursor: 'pointer', opacity: n <= estrellas ? 1 : 0.3 }}>
            ⭐
          </button>
        ))}
      </div>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
        {estrellas === 1 ? 'Muy malo' : estrellas === 2 ? 'Malo' : estrellas === 3 ? 'Regular' : estrellas === 4 ? 'Bueno' : 'Excelente'}
      </p>

      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Comentario</label>
      <textarea placeholder="Cuéntanos tu experiencia..." value={comentario} onChange={(e) => setComentario(e.target.value)}
        rows={4}
        style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />

      {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}

      <button onClick={handleEnviar} disabled={cargando}
        style={{ width: '100%', padding: '12px', backgroundColor: '#1a56db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
        {cargando ? 'Enviando...' : 'Enviar Reseña'}
      </button>
    </div>
  )
}