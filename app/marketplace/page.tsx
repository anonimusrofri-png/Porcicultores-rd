'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const provincias = [
  'Todas','Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional',
  'Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor',
  'Hermanas Mirabal','Independencia','La Altagracia','La Romana',
  'La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi',
  'Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná',
  'San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís',
  'Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde'
]

const tiposAnimales = ['Todos','cerdo','lechon','cerda','verraco','reproductor','engorde']

export default function Marketplace() {
  const router = useRouter()
  const [publicaciones, setPublicaciones] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [provincia, setProvincia] = useState('Todas')
  const [tipo, setTipo] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [provincia, tipo])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)

    if (!user) {
      setCargando(false)
      return
    }

    let query = supabase
      .from('publicaciones')
      .select('*, perfiles(nombre, provincia, whatsapp, telefono)')
      .eq('activo', true)
      .eq('estado', 'aprobada')

    if (provincia !== 'Todas') query = query.eq('provincia', provincia)
    if (tipo !== 'Todos') query = query.eq('tipo_animal', tipo)

    const { data } = await query.order('created_at', { ascending: false })
    setPublicaciones(data || [])
    setCargando(false)
  }

  const publicacionesFiltradas = publicaciones.filter(p =>
    busqueda === '' || p.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) || p.tipo_animal?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (!usuario && !cargando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '48px', maxWidth: '480px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Acceso exclusivo para miembros</h2>
        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>Para proteger la comunidad y brindar una experiencia mas segura, debes crear una cuenta gratuita para acceder a las publicaciones, contactar usuarios y utilizar todas las funciones de Porcicultores RD.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/registro" style={{ backgroundColor: '#0a2463', color: 'white', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>Crear Cuenta</Link>
          <Link href="/login" style={{ backgroundColor: '#f0f4f8', color: '#0a2463', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>Iniciar Sesion</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900' }}>Marketplace Porcino</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Republica Dominicana</p>
        </div>
        <Link href="/publicar" style={{ backgroundColor: '#0a2463', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
          Publicar
        </Link>
      </div>

      <input placeholder="Buscar cerdos, lechones..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        style={{ width: '100%', padding: '14px 16px', marginBottom: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' }} />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {tiposAnimales.map(t => (
          <button key={t} onClick={() => setTipo(t)}
            style={{ padding: '8px 18px', borderRadius: '20px', border: '1px solid #e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: tipo === t ? '700' : '500', backgroundColor: tipo === t ? '#0a2463' : 'white', color: tipo === t ? 'white' : '#64748b', fontSize: '13px' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white' }}>
        {provincias.map(p => <option key={p} value={p}>{p}</option>)}
      </select>

      {cargando ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando publicaciones...</p>
      ) : publicacionesFiltradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No hay publicaciones disponibles</p>
          <Link href="/publicar" style={{ color: '#0a2463', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>Se el primero en publicar</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {publicacionesFiltradas.map((pub) => (
            <div key={pub.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {pub.foto_url ? (
                <img src={pub.foto_url} alt="animal" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '180px', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '48px' }}>🐷</div>
              )}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{pub.tipo_animal}</span>
                  <span style={{ color: '#16a34a', fontWeight: '900', fontSize: '18px' }}>RD$ {pub.precio?.toLocaleString()}</span>
                </div>
                <p style={{ color: '#475569', fontSize: '13px', marginBottom: '4px', lineHeight: 1.5 }}>{pub.descripcion}</p>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Peso: {pub.peso} lbs</p>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px' }}>Provincia: {pub.provincia}</p>
                <p style={{ color: '#0a2463', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>Vendedor: {pub.perfiles?.nombre}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {pub.perfiles?.whatsapp && (
                    <a href={`https://wa.me/1${pub.perfiles.whatsapp.replace(/\D/g,'')}`} target="_blank"
                      style={{ flex: 1, backgroundColor: '#25d366', color: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                      WhatsApp
                    </a>
                  )}
                  <Link href="/chat"
                    style={{ flex: 1, backgroundColor: '#0a2463', color: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                    Mensaje
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}