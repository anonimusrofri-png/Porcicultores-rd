'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = ['Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional','Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal','Independencia','La Altagracia','La Romana','La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná','San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís','Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde']

export default function Comprar() {
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [tipoAnimal, setTipoAnimal] = useState('cerdo')
  const [cantidad, setCantidad] = useState('')
  const [provincia, setProvincia] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [presupuesto, setPresupuesto] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)
    const { data } = await supabase.from('solicitudes_compra').select('*, perfiles(nombre, provincia, whatsapp, telefono)').eq('activo', true).order('created_at', { ascending: false })
    setSolicitudes(data || [])
    setCargando(false)
  }

  const enviarSolicitud = async () => {
    if (!provincia || !descripcion) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    await supabase.from('solicitudes_compra').insert({ usuario_id: user.id, tipo_animal: tipoAnimal, cantidad: parseInt(cantidad) || 1, provincia, descripcion, presupuesto: presupuesto ? parseFloat(presupuesto) : null, activo: true })
    setEnviado(true)
    cargarDatos()
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900', margin: 0 }}>Necesito Comprar</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>

      {usuario && !enviado && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#0a2463', fontWeight: '800', marginBottom: '16px' }}>Publicar Solicitud de Compra</h3>
          <select value={tipoAnimal} onChange={(e) => setTipoAnimal(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white' }}>
            <option value="cerdo">Cerdo</option>
            <option value="lechon">Lechon</option>
            <option value="cerda">Cerda</option>
            <option value="verraco">Barraco</option>
            <option value="reproductor">Reproductor</option>
          </select>
          <input type="number" placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
          <select value={provincia} onChange={(e) => setProvincia(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white' }}>
            <option value="">Selecciona tu provincia</option>
            {provincias.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input type="number" placeholder="Presupuesto en RD$ (opcional)" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
          <textarea placeholder="Describe lo que necesitas..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
          <button onClick={enviarSolicitud} style={{ backgroundColor: '#0a2463', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>Publicar Solicitud</button>
        </div>
      )}

      {enviado && <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '20px', marginBottom: '24px', color: '#16a34a', fontWeight: '700' }}>Solicitud publicada. Los vendedores podran contactarte.</div>}

      {!usuario && <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fcd34d', borderRadius: '12px', padding: '16px', marginBottom: '24px', fontSize: '14px', color: '#92400e' }}>
        <Link href="/login" style={{ color: '#0a2463', fontWeight: '700' }}>Inicia sesion</Link> para publicar tu solicitud de compra.
      </div>}

      <h2 style={{ color: '#0a2463', fontWeight: '800', marginBottom: '16px' }}>Solicitudes Activas ({solicitudes.length})</h2>
      {cargando ? <p style={{ color: '#64748b' }}>Cargando...</p> : solicitudes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#94a3b8' }}>No hay solicitudes activas</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {solicitudes.map((sol) => (
            <div key={sol.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '8px', display: 'inline-block' }}>Busco: {sol.tipo_animal === 'verraco' ? 'Barraco' : sol.tipo_animal}</span>
                <p style={{ color: '#1e293b', fontSize: '14px', margin: '4px 0' }}>{sol.descripcion}</p>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0' }}>Cantidad: {sol.cantidad} — Provincia: {sol.provincia}</p>
                {sol.presupuesto && <p style={{ color: '#16a34a', fontSize: '13px', fontWeight: '700', margin: '4px 0' }}>Presupuesto: RD$ {sol.presupuesto?.toLocaleString()}</p>}
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '4px 0' }}>Comprador: {sol.perfiles?.nombre}</p>
              </div>
              {sol.perfiles?.whatsapp && (
                <a href={`https://wa.me/1${sol.perfiles.whatsapp.replace(/\D/g,'')}`} target="_blank" style={{ backgroundColor: '#25d366', color: 'white', padding: '12px 20px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}>WhatsApp</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}