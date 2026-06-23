'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Reportar() {
  const [usuario, setUsuario] = useState<any>(null)
  const [usuarioReportado, setUsuarioReportado] = useState('')
  const [motivo, setMotivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [usuarios, setUsuarios] = useState<any[]>([])

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    setUsuario(user)
    const { data } = await supabase.from('perfiles').select('id, nombre').neq('id', user.id)
    setUsuarios(data || [])
  }

  const handleReportar = async () => {
    if (!usuarioReportado || !motivo) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }
    setCargando(true)
    setError('')
    const { error } = await supabase.from('reportes').insert({
      reportado_por: usuario.id,
      usuario_reportado: usuarioReportado,
      motivo,
      descripcion,
    })
    if (error) {
      setError('Error al enviar el reporte. Intenta de nuevo.')
    } else {
      setEnviado(true)
    }
    setCargando(false)
  }

  if (enviado) return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', border: '1px solid #ddd', borderRadius: '12px' }}>
      <p style={{ fontSize: '48px' }}>✅</p>
      <h2 style={{ color: '#16a34a' }}>Reporte enviado</h2>
      <p style={{ color: '#64748b' }}>Nuestro equipo revisará el reporte a la brevedad.</p>
      <Link href="/" style={{ color: '#1a56db' }}>← Volver al inicio</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '40px', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#dc2626' }}>🚨 Reportar Usuario</h1>
        <Link href="/" style={{ color: '#1a56db', textDecoration: 'none' }}>← Inicio</Link>
      </div>

      <div style={{ backgroundColor: '#fef9c3', border: '1px solid #eab308', borderRadius: '12px', padding: '12px', marginBottom: '20px', fontSize: '14px' }}>
        ⚠️ Los reportes falsos pueden resultar en la suspensión de tu cuenta. Usa esta función solo para reportar comportamiento inapropiado, estafas o perfiles falsos.
      </div>

      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Usuario a reportar *</label>
      <select value={usuarioReportado} onChange={(e) => setUsuarioReportado(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
        <option value="">Selecciona un usuario</option>
        {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
      </select>

      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Motivo *</label>
      <select value={motivo} onChange={(e) => setMotivo(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
        <option value="">Selecciona un motivo</option>
        <option value="estafa">Estafa o fraude</option>
        <option value="perfil_falso">Perfil falso</option>
        <option value="informacion_falsa">Información falsa en publicación</option>
        <option value="comportamiento">Comportamiento inapropiado</option>
        <option value="otro">Otro</option>
      </select>

      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Descripción adicional</label>
      <textarea placeholder="Describe el problema con más detalle..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
        rows={4}
        style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />

      {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}

      <button onClick={handleReportar} disabled={cargando}
        style={{ width: '100%', padding: '12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
        {cargando ? 'Enviando...' : 'Enviar Reporte'}
      </button>
    </div>
  )
}