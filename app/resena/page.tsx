'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Resena() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('')
  const [estrellas, setEstrellas] = useState(5)
  const [comentario, setComentario] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    supabase.from('perfiles').select('id, nombre').order('nombre').then(({ data }) => setUsuarios(data || []))
  }, [])

  const enviarResena = async () => {
    if (!usuarioSeleccionado) return
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    await supabase.from('resenas').insert({ de_usuario: user.id, para_usuario: usuarioSeleccionado, estrellas, comentario })
    setEnviado(true)
    setCargando(false)
  }

  if (enviado) return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
      <h2 style={{ color: '#16a34a', marginBottom: '12px' }}>Resena enviada</h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Gracias por tu resena. Ayuda a otros usuarios a conocer mejor a los vendedores.</p>
      <Link href="/" style={{ backgroundColor: '#0a2463', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700' }}>Volver al Inicio</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: '560px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '900', margin: 0 }}>Dejar una Resena</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px' }}>Volver</Link>
      </div>
      <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px' }}>Usuario a evaluar</label>
        <select value={usuarioSeleccionado} onChange={(e) => setUsuarioSeleccionado(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white' }}>
          <option value="">Selecciona un usuario</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
        </select>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '13px' }}>Calificacion</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setEstrellas(n)}
              style={{ fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer', color: n <= estrellas ? '#fbbf24' : '#e2e8f0' }}>★</button>
          ))}
        </div>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px' }}>Comentario (opcional)</label>
        <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Describe tu experiencia con este usuario..." rows={4} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
        <button onClick={enviarResena} disabled={cargando || !usuarioSeleccionado} style={{ width: '100%', padding: '14px', backgroundColor: '#0a2463', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>
          {cargando ? 'Enviando...' : 'Enviar Resena'}
        </button>
      </div>
    </div>
  )
}