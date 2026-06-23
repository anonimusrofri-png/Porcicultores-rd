'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const categorias = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'veterinaria', label: 'Veterinarias' },
  { valor: 'farmacia_veterinaria', label: 'Farmacias' },
  { valor: 'tienda_alimento', label: 'Alimentos' },
  { valor: 'transportista', label: 'Transportistas' },
  { valor: 'servicio_porcino', label: 'Servicios' },
]

const provincias = [
  'Todas','Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional',
  'Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor',
  'Hermanas Mirabal','Independencia','La Altagracia','La Romana',
  'La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi',
  'Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná',
  'San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís',
  'Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde'
]

export default function Directorio() {
  const [negocios, setNegocios] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [categoria, setCategoria] = useState('todos')
  const [provincia, setProvincia] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [categoria, provincia])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)
    if (!user) { setCargando(false); return }
    let query = supabase.from('directorio').select('*')
    if (categoria !== 'todos') query = query.eq('categoria', categoria)
    if (provincia !== 'Todas') query = query.eq('provincia', provincia)
    const { data } = await query.order('nombre')
    setNegocios(data || [])
    setCargando(false)
  }

  const negociosFiltrados = negocios.filter(n =>
    busqueda === '' || n.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (!usuario && !cargando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '48px', maxWidth: '480px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Acceso exclusivo para miembros</h2>
        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>Debes crear una cuenta gratuita para acceder al directorio porcino.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/registro" style={{ backgroundColor: '#0a2463', color: 'white', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>Crear Cuenta</Link>
          <Link href="/login" style={{ backgroundColor: '#f0f4f8', color: '#0a2463', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>Iniciar Sesion</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900' }}>Directorio Porcino</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Servicios especializados en RD</p>
        </div>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>

      <input placeholder="Buscar veterinarias, alimentos..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        style={{ width: '100%', padding: '14px 16px', marginBottom: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' }} />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categorias.map(cat => (
          <button key={cat.valor} onClick={() => setCategoria(cat.valor)}
            style={{ padding: '8px 18px', borderRadius: '20px', border: '1px solid #e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: categoria === cat.valor ? '700' : '500', backgroundColor: categoria === cat.valor ? '#0a2463' : 'white', color: categoria === cat.valor ? 'white' : '#64748b', fontSize: '13px' }}>
            {cat.label}
          </button>
        ))}
      </div>

      <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white' }}>
        {provincias.map(p => <option key={p} value={p}>{p}</option>)}
      </select>

      {cargando ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando directorio...</p>
      ) : negociosFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '600' }}>No hay negocios en esta categoria</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {negociosFiltrados.map((neg) => (
            <div key={neg.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ color: '#0a2463', fontWeight: '800', fontSize: '18px', marginBottom: '4px' }}>{neg.nombre}</h3>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                    {categorias.find(c => c.valor === neg.categoria)?.label}
                  </span>
                </div>
                {neg.verificado && (
                  <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Verificado</span>
                )}
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>Provincia: {neg.provincia}</p>
              {neg.direccion && <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>Direccion: {neg.direccion}</p>}
              {neg.descripcion && <p style={{ color: '#475569', fontSize: '14px', marginBottom: '12px', lineHeight: 1.6 }}>{neg.descripcion}</p>}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {neg.telefono && (
                  <a href={`tel:${neg.telefono}`}
                    style={{ backgroundColor: '#f0f4f8', color: '#0a2463', padding: '10px 16px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                    Llamar: {neg.telefono}
                  </a>
                )}
                {neg.whatsapp && (
                  <a href={`https://wa.me/1${neg.whatsapp.replace(/\D/g,'')}`} target="_blank"
                    style={{ backgroundColor: '#25d366', color: 'white', padding: '10px 16px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                    WhatsApp
                  </a>
                )}
                <Link href="/chat"
                  style={{ backgroundColor: '#0a2463', color: 'white', padding: '10px 16px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                  Chat Privado
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}