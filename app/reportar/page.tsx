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
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 20px', fontFamily: "'Inter', sans-serif", minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px 24px', textAlign: 'center', border: '1px solid #E5E7EB', width: '100%' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ color: '#1A3C5E', fontWeight: '700', margin: '0 0 10px 0', fontSize: '20px' }}>Reporte enviado</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>El administrador revisará tu reporte. Gracias por ayudar a mantener la plataforma segura.</p>
        <Link href="/" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Volver al Inicio</Link>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', fontFamily: "'Inter', sans-serif", backgroundColor: '#F4F6F9', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: '0 0 2px 0' }}>Reporte de Estafas</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Ayúdanos a mantener la comunidad segura</p>
        </div>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>← Inicio</Link>
      </div>

      {/* Banner de seguridad */}
      <div style={{ backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '14px', padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '24px', flexShrink: 0 }}>🛡️</span>
        <div>
          <p style={{ color: '#111827', fontWeight: '700', fontSize: '14px', margin: '0 0 4px 0' }}>Tu seguridad es nuestra prioridad</p>
          <p style={{ color: '#6B7280', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>Si has sido víctima de un fraude o detectas un perfil falso, repórtalo de inmediato. El administrador tomará acción.</p>
        </div>
      </div>

      {/* Botón rápido para reportar transportista */}
      <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '14px', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '22px' }}>🚛</span>
          <div>
            <p style={{ color: '#1A3C5E', fontWeight: '600', fontSize: '13px', margin: '0 0 2px 0' }}>¿Quieres reportar a un transportista?</p>
            <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>Selecciona el motivo "Transportista" abajo</p>
          </div>
        </div>
        <button onClick={() => setMotivo('transportista')}
          style={{ backgroundColor: '#1A3C5E', color: 'white', border: 'none', padding: '9px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', flexShrink: 0 }}>
          Reportar aquí
        </button>
      </div>

      {/* Formulario */}
      <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ color: '#111827', fontWeight: '600', fontSize: '15px', margin: '0 0 16px 0', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>Nueva Denuncia</h3>

        {/* Usuario a reportar */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
            👤 Usuario o Publicación
          </label>
          <select value={usuarioReportado} onChange={(e) => setUsuarioReportado(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB', boxSizing: 'border-box' }}>
            <option value="">Selecciona el usuario a reportar</option>
            {usuarios.filter(u => u.tipo !== 'admin').map(u => (
              <option key={u.id} value={u.id}>{u.nombre} {u.tipo === 'transportista' ? '🚛' : ''}</option>
            ))}
          </select>
        </div>

        {/* Motivo */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
            ⚠️ Motivo del Reporte
          </label>
          <select value={motivo} onChange={(e) => setMotivo(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${motivo ? '#2563A8' : '#E5E7EB'}`, fontSize: '13px', backgroundColor: '#F9FAFB', boxSizing: 'border-box' }}>
            <option value="">Selecciona el motivo</option>
            <option value="estafa">💸 Estafa o fraude</option>
            <option value="perfil_falso">🎭 Perfil falso</option>
            <option value="transportista">🚛 Transportista — mal servicio o estafa</option>
            <option value="acoso">🚨 Acoso o amenazas</option>
            <option value="publicacion_falsa">📋 Publicación falsa</option>
            <option value="otro">📝 Otro</option>
          </select>
          {motivo === 'transportista' && (
            <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px', padding: '10px 12px', marginTop: '8px' }}>
              <p style={{ color: '#92400E', fontSize: '12px', margin: 0 }}>🚛 Estás reportando a un transportista. Describe el problema con detalle para que el administrador pueda actuar.</p>
            </div>
          )}
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
            ✏️ Descripción de lo sucedido
          </label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe detalladamente lo que ocurrió, fechas, montos, nombres, etc..." rows={4}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB', boxSizing: 'border-box', resize: 'vertical', outline: 'none', lineHeight: 1.6 }} />
        </div>

        {/* Evidencia */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            📎 Evidencia (Opcional)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button style={{ height: '56px', backgroundColor: '#F3F4F6', border: '1px dashed #D1D5DB', borderRadius: '10px', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>📷</span>
              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>Foto</span>
            </button>
            <button style={{ height: '56px', backgroundColor: '#F3F4F6', border: '1px dashed #D1D5DB', borderRadius: '10px', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>📎</span>
              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>Archivo</span>
            </button>
          </div>
        </div>

        <button onClick={enviarReporte} disabled={cargando || !usuarioReportado || !motivo}
          style={{ width: '100%', padding: '14px', background: cargando || !usuarioReportado || !motivo ? '#E5E7EB' : 'linear-gradient(135deg, #DC2626, #EF4444)', color: cargando || !usuarioReportado || !motivo ? '#9CA3AF' : 'white', border: 'none', borderRadius: '10px', cursor: cargando || !usuarioReportado || !motivo ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '15px' }}>
          {cargando ? '⏳ Enviando...' : '🚨 Enviar Reporte'}
        </button>
      </div>

      {/* Aviso */}
      <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
          Los reportes son confidenciales. El administrador revisará tu caso en un máximo de 24 horas.
        </p>
      </div>
    </div>
  )
}