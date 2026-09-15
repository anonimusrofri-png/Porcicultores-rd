'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function Reportar() {
  const [usuarioReportado, setUsuarioReportado] = useState('')
  const [motivo, setMotivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setMensaje('')

    const { error } = await supabase.from('reportes').insert([
      {
        usuario_reportado: usuarioReportado,
        motivo,
        descripcion,
      },
    ])

    if (error) {
      setMensaje(`Error al enviar el reporte: ${error.message}`)
    } else {
      setMensaje('Reporte enviado correctamente. Lo revisaremos a la brevedad.')
      setUsuarioReportado('')
      setMotivo('')
      setDescripcion('')
    }
    setCargando(false)
  }

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', fontFamily: "'Inter', sans-serif", backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '20px' }}>
      
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0253A3', margin: 0 }}>Reporte de Estafas</h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Ayúdanos a mantener la comunidad segura
          </p>
        </div>
        <Link href="/" style={{ color: '#0253A3', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
          ← Inicio
        </Link>
      </div>

      {/* Alerta de seguridad */}
      <div style={{ backgroundColor: '#FFF8F0', border: '1px solid #FFEDD5', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#9A3412', margin: '0 0 6px 0' }}>
          Tu seguridad es nuestra prioridad
        </h3>
        <p style={{ fontSize: '12px', color: '#C2410C', margin: 0, lineHeight: '1.4' }}>
          Si has sido víctima de un fraude o detectas un perfil falso, repórtalo de inmediato.
        </p>
      </div>

      {/* Formulario */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B', marginTop: 0, marginBottom: '16px' }}>
          Nueva Denuncia
        </h2>

        {mensaje && (
          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#1E40AF', fontSize: '12px', marginBottom: '14px', textAlign: 'center' }}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Usuario a reportar
            </label>
            <input
              type="text"
              required
              value={usuarioReportado}
              onChange={(e) => setUsuarioReportado(e.target.value)}
              placeholder="Nombre o teléfono del usuario"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Motivo del Reporte
            </label>
            <select
              required
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#334155', boxSizing: 'border-box' }}>
              <option value="">Selecciona el motivo</option>
              <option value="estafa">Intento de estafa o cobro falso</option>
              <option value="perfil_falso">Perfil o datos falsos</option>
              <option value="incumplimiento">Incumplimiento de entrega o pago</option>
              <option value="otro">Otro motivo</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Descripción
            </label>
            <textarea
              required
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe detalladamente lo que ocurrió..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              backgroundColor: '#0253A3',
              color: 'white',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              marginTop: '6px'
            }}>
            {cargando ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </form>
      </div>

    </div>
  )
}