'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { useSearchParams, Suspense } from 'next/navigation'

function ResenaContenido() {
  const searchParams = useSearchParams()
  const paraParam = searchParams.get('para')
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [paraUsuario, setParaUsuario] = useState(paraParam || '')
  const [estrellas, setEstrellas] = useState(5)
  const [comentario, setComentario] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    supabase.from('perfiles').select('id, nombre').order('nombre').then(({ data }) => setUsuarios(data || []))
  }, [])

  const enviar = async () => {
    if (!paraUsuario) return
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    await supabase.from('resenas').insert({ de_usuario: user.id, para_usuario: paraUsuario, estrellas, comentario })
    const { data: resenas } = await supabase.from('resenas').select('estrellas').eq('para_usuario', paraUsuario)
    if (resenas && resenas.length > 0) {
      const promedio = resenas.reduce((s: number, r: any) => s + r.estrellas, 0) / resenas.length
      await supabase.from('perfiles').update({ estrellas: Math.round(promedio * 10) / 10 }).eq('id', paraUsuario)
    }
    setEnviado(true)
    setCargando(false)
  }

  if (enviado) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px 24px', maxWidth: '420px', textAlign: 'center', border: '1px solid #E5E7EB', width: '100%' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>\u2B50</div>
        <h2 style={{ color: '#1A3C5E', fontWeight: '700', margin: '0 0 10px 0' }}>Rese\u00f1a enviada</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>Gracias por tu opini\u00f3n. Ayudas a la comunidad.</p>
        <Link href="/" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Volver al Inicio</Link>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F6F9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: '0 0 2px 0' }}>Dejar Rese\u00f1a</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Califica tu experiencia con otro usuario</p>
        </div>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>\u2190 Inicio</Link>
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #E5E7EB' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>\uD83D\uDC64 Usuario a calificar</label>
          <select value={paraUsuario} onChange={(e) => setParaUsuario(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB' }}>
            <option value="">Selecciona un usuario</option>
            {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>\u2B50 Calificaci\u00f3n</label>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setEstrellas(n)}
                style={{ fontSize: '32px', background: 'none', border: 'none', cursor: 'pointer', color: n <= estrellas ? '#F59E0B' : '#E5E7EB', transition: 'all 0.2s' }}>
                \u2605
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '13px', marginTop: '8px' }}>
            {estrellas === 1 ? 'Muy malo' : estrellas === 2 ? 'Malo' : estrellas === 3 ? 'Regular' : estrellas === 4 ? 'Bueno' : 'Excelente'}
          </p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>\u270F\uFE0F Comentario (opcional)</label>
          <textarea value={comentario} onChange={(e) => setComentario(e.target.value)}
            placeholder="Describe tu experiencia con este usuario..." rows={4}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB', boxSizing: 'border-box', resize: 'vertical', outline: 'none' }} />
        </div>
        <button onClick={enviar} disabled={cargando || !paraUsuario}
          style={{ width: '100%', padding: '14px', background: cargando || !paraUsuario ? '#E5E7EB' : 'linear-gradient(135deg, #1A3C5E, #2563A8)', color: cargando || !paraUsuario ? '#9CA3AF' : 'white', border: 'none', borderRadius: '10px', cursor: cargando || !paraUsuario ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '15px' }}>
          {cargando ? '\u23F3 Enviando...' : '\u2B50 Enviar Rese\u00f1a'}
        </button>
      </div>
    </div>
  )
}

export default function Resena() {
  return <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>}><ResenaContenido /></Suspense>
}
