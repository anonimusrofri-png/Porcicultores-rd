'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = [
  'Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional',
  'Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor',
  'Hermanas Mirabal','Independencia','La Altagracia','La Romana',
  'La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi',
  'Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná',
  'San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís',
  'Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde'
]

export default function Comprar() {
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [tipoAnimal, setTipoAnimal] = useState('cerdo')
  const [cantidad, setCantidad] = useState('')
  const [provincia, setProvincia] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [presupuesto, setPresupuesto] = useState('')
  const [cargando, setCargando] = useState(true)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)
    const { data } = await supabase
      .from('solicitudes_compra')
      .select('*, perfiles(nombre, provincia, whatsapp)')
      .eq('activo', true)
      .order('created_at', { ascending: false })
    setSolicitudes(data || [])
    setCargando(false)
  }

  const handleEnviar = async () => {
    if (!provincia || !descripcion || !cantidad) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }
    if (!usuario) {
      setError('Debes iniciar sesion para publicar una solicitud')
      return
    }
    const { error } = await supabase.from('solicitudes_compra').insert({
      usuario_id: usuario.id,
      tipo_animal: tipoAnimal,
      cantidad: parseInt(cantidad),
      provincia,
      descripcion,
      presupuesto: presupuesto ? parseFloat(presupuesto) : null,
      activo: true,
    })
    if (error) {
      setError('Error al enviar la solicitud.')
    } else {
      setEnviado(true)
      setMostrarFormulario(false)
      cargarDatos()
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '800' }}>Necesito Comprar</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Publica lo que necesitas y los vendedores te contactaran</p>
        </div>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px' }}>Volver</Link>
      </div>

      {enviado && (
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '16px', marginBottom: '20px', color: '#16a34a', fontWeight: '600' }}>
          Tu solicitud fue publicada exitosamente. Los vendedores interesados te contactaran.
        </div>
      )}

      <button onClick={() => setMostrarFormulario(!mostrarFormulario)}
        style={{ width: '100%', padding: '14px', backgroundColor: '#0a2463', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', marginBottom: '24px' }}>
        {mostrarFormulario ? 'Cancelar' : 'Publicar Solicitud de Compra'}
      </button>

      {mostrarFormulario && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ color: '#0a2463', marginBottom: '20px', fontWeight: '700' }}>Nueva Solicitud</h3>

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Tipo de animal</label>
          <select value={tipoAnimal} onChange={(e) => setTipoAnimal(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}>
            <option value="cerdo">Cerdo</option>
            <option value="lechon">Lechon</option>
            <option value="cerda">Cerda</option>
            <option value="verraco">Verraco</option>
            <option value="reproductor">Reproductor</option>
            <option value="engorde">Engorde</option>
          </select>

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Cantidad que necesita</label>
          <input type="number" placeholder="Ej: 20" value={cantidad} onChange={(e) => setCantidad(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Provincia</label>
          <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}>
            <option value="">Selecciona una provincia</option>
            {provincias.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Presupuesto en RD$ (opcional)</label>
          <input type="number" placeholder="Ej: 50000" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Descripcion</label>
          <textarea placeholder="Describe lo que necesitas..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

          {error && <p style={{ color: '#dc2626', marginBottom: '12px', fontSize: '14px' }}>{error}</p>}

          <button onClick={handleEnviar}
            style={{ width: '100%', padding: '14px', backgroundColor: '#c1121f', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>
            Publicar Solicitud
          </button>
        </div>
      )}

      {cargando ? (
        <p style={{ color: '#64748b' }}>Cargando solicitudes...</p>
      ) : solicitudes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No hay solicitudes todavia</p>
          <p style={{ fontSize: '14px' }}>Se el primero en publicar lo que necesitas</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {solicitudes.map((sol) => (
            <div key={sol.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                    Busco: {sol.tipo_animal}
                  </span>
                </div>
                <span style={{ color: '#64748b', fontSize: '12px' }}>{sol.created_at?.slice(0, 10)}</span>
              </div>
              <p style={{ color: '#1e293b', fontSize: '15px', marginBottom: '8px', lineHeight: 1.6 }}>{sol.descripcion}</p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Cantidad: {sol.cantidad}</span>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Provincia: {sol.provincia}</span>
                {sol.presupuesto && <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: '700' }}>Presupuesto: RD$ {sol.presupuesto?.toLocaleString()}</span>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {sol.perfiles?.whatsapp && (
                  <a href={`https://wa.me/1${sol.perfiles.whatsapp.replace(/\D/g,'')}`} target="_blank"
                    style={{ backgroundColor: '#25d366', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                    Contactar por WhatsApp
                  </a>
                )}
                <Link href="/chat" style={{ backgroundColor: '#0a2463', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                  Mensaje Privado
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}