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
    supabase.from('perfiles').select('id, nombre, tipo').order('nombre').then(({ data }) => setUsuarios(data || []))
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
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif', minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px 24px', textAlign: 'center', border: '1px solid #E5E7EB', width: '100%' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>\u2705</div>
        <h2 style={{ color: '#1A3C5E', fontWeight: '700', margin: '0 0 10px 0', fontSize: '20px' }}>Reporte enviado</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>El administrador revisar\u00e1 tu reporte en un m\u00e1ximo de 24 horas.</p>
        <Link href="/" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Volver al Inicio</Link>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F6F9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: '0 0 2px 0' }}>Reporte de Estafas</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Ay\u00fadanos a mantener la comunidad segura</p>
        </div>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>\u2190 Inicio</Link>
      </div>
      <div style={{ backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '14px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '24px', flexShrink: 0 }}>\uD83D\uDEE1\uFE0F</span>
        <div>
          <p style={{ color: '#111827', fontWeight: '700', fontSize: '14px', margin: '0 0 4px 0' }}>Tu seguridad es nuestra prioridad</p>
          <p style={{ color: '#6B7280', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>Si has sido v\u00edctima de un fraude o detectas un perfil falso, rep\u00f3rtalo de inmediato.</p>
        </div>
      </div>
      <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ color: '#111827', fontWeight: '600', fontSize: '15px', margin: '0 0 16px 0', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>Nueva Denuncia</h3>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>\uD83D\uDC64 Usuario a reportar</label>
          <select value={usuarioReportado} onChange={(e) => setUsuarioReportado(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB', boxSizing: 'border-box' }}>
            <option value="">Selecciona el usuario a reportar</option>
            {usuarios.filter(u => u.tipo !== 'admin').map(u => (
              <option key={u.id} value={u.id}>{u.nombre} {u.tipo === 'transportista' ? '\uD83D\uDE9B' : u.tipo === 'vendedor' ? '\uD83D\uDC37' : ''}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>\u26A0\uFE0F Motivo del Reporte</label>
          <select value={motivo} onChange={(e) => setMotivo(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: motivo ? '1px solid #2563A8' : '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB', boxSizing: 'border-box' }}>
            <option value="">Selecciona el motivo</option>
            <option value="estafa">\uD83D\uDCB8 Estafa o fraude</option>
            <option value="perfil_falso">\uD83C\uDFAD Perfil falso</option>
            <option value="acoso">\uD83D\uDEA8 Acoso o amenazas</option>
            <option value="publicacion_falsa">\uD83D\uDCCB Publicaci\u00f3n falsa</option>
            <option value="mal_servicio">\u2B50 Mal servicio</option>
            <option value="otro">\uD83D\uDCDD Otro</option>
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>\u270F\uFE0F Descripci\u00f3n</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe detalladamente lo que ocurri\u00f3..." rows={4}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB', boxSizing: 'border-box', resize: 'vertical', outline: 'none', lineHeight: 1.6 }} />
        </div>
        <button onClick={enviarReporte} disabled={cargando || !usuarioReportado || !motivo}
          style={{ width: '100%', padding: '14px', background: (cargando || !usuarioReportado || !motivo) ? '#E5E7EB' : 'linear-gradient(135deg, #DC2626, #EF4444)', color: (cargando || !usuarioReportado || !motivo) ? '#9CA3AF' : 'white', border: 'none', borderRadius: '10px', cursor: (cargando || !usuarioReportado || !motivo) ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '15px' }}>
          {cargando ? '\u23F3 Enviando...' : '\uD83D\uDEA8 Enviar Reporte'}
        </button>
      </div>
      <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>Los reportes son confidenciales. El administrador revisar\u00e1 tu caso en un m\u00e1ximo de 24 horas.</p>
      </div>
    </div>
  )
}
