'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Reportar() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [usuarioReportado, setUsuarioReportado] = useState('')
  const [motivo, setMotivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    supabase.from('perfiles').select('id, nombre').order('nombre').then(({ data }) => setUsuarios(data || []))
  }, [])

  const enviarReporte = async () => {
    if (!usuarioReportado || !motivo) return
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    await supabase.from('reportes').insert({ reportado_por: user.id, usuario_reportado: usuarioReportado, motivo, descripcion, resuelto: false })
    setEnviado(true)
    setCargando(false)
  }

  if (enviado) return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#16a34a', marginBottom: '12px' }}>Reporte enviado</h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>El administrador revisara tu reporte. Gracias por ayudar a mantener la plataforma segura.</p>
      <Link href="/" style={{ backgroundColor: '#0a2463', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700' }}>Volver al Inicio</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: '560px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '900', margin: 0 }}>Reportar Usuario</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px' }}>Volver</Link>
      </div>
      <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px' }}>Usuario a reportar</label>
        <select value={usuarioReportado} onChange={(e) => setUsuarioReportado(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white' }}>
          <option value="">Selecciona un usuario</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
        </select>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px' }}>Motivo</label>
        <select value={motivo} onChange={(e) => setMotivo(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white' }}>
          <option value="">Selecciona el motivo</option>
          <option value="estafa">Estafa o fraude</option>
          <option value="perfil_falso">Perfil falso</option>
          <option value="acoso">Acoso o amenazas</option>
          <option value="publicacion_falsa">Publicacion falsa</option>
          <option value="otro">Otro</option>
        </select>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px' }}>Descripcion (opcional)</label>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Describe lo que ocurrio..." rows={4} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
        <button onClick={enviarReporte} disabled={cargando || !usuarioReportado || !motivo} style={{ width: '100%', padding: '14px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>
          {cargando ? 'Enviando...' : 'Enviar Reporte'}
        </button>
      </div>
    </div>
  )
}