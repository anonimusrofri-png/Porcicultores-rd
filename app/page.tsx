'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

const provincias = [
  'Todas', 'Azua', 'Bahoruco', 'Barahona', 'Dajabón', 'Distrito Nacional', 'Duarte', 'Elías Piña', 
  'El Seibo', 'Espaillat', 'Hato Mayor', 'Hermanas Mirabal', 'Independencia', 'La Altagracia', 
  'La Romana', 'La Vega', 'María Trinidad Sánchez', 'Monseñor Nouel', 'Monte Cristi', 
  'Monte Plata', 'Pedernales', 'Peravia', 'Puerto Plata', 'Samaná', 'San Cristóbal', 
  'San José de Ocoa', 'San Juan', 'San Pedro de Macorís', 'Sánchez Ramírez', 'Santiago', 
  'Santiago Rodríguez', 'Santo Domingo', 'Valverde'
]

const tiposAnimales = [
  { valor: 'todos', label: '🐷 Todos' },
  { valor: 'cerdo', label: 'Cerdo' },
  { valor: 'lechon', label: 'Lechón' },
  { valor: 'cerda', label: 'Cerda' },
  { valor: 'verraco', label: 'Barraco' },
  { valor: 'engorde', label: 'Engorde' },
]

export default function Home() {
  const [publicaciones, setPublicaciones] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [provinciaFiltro, setProvinciaFiltro] = useState('Todas')
  const [tipoFiltro, setTipoFiltro] = useState('todos')

  useEffect(() => {
    cargarPublicaciones()
  }, [])

  const cargarPublicaciones = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('publicaciones')
      .select('*, perfiles:usuario_id(nombre, telefono)')
      .eq('activo', true)
      .order('created_at', { ascending: false })

    if (!error) {
      setPublicaciones(data || [])
    }
    setCargando(false)
  }

  const publicacionesFiltradas = publicaciones.filter((p) => {
    const coincideTexto = p.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
                          p.tipo_animal?.toLowerCase().includes(busqueda.toLowerCase())
    const coincideProvincia = provinciaFiltro === 'Todas' || p.provincia === provinciaFiltro
    const coincideTipo = tipoFiltro === 'todos' || p.tipo_animal === tipoFiltro

    return coincideTexto && coincideProvincia && coincideTipo
  })

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', fontFamily: "'Inter', sans-serif", backgroundColor: '#FFFFFF', minHeight: '100vh', boxShadow: '0 0 20px rgba(0,0,0,0.05)', paddingBottom: '80px' }}>
      
      {/* Encabezado Principal */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0253A3', margin: 0, letterSpacing: '-0.5px' }}>Porcicultores RD</h1>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>El mercado porcino de RD</p>
        </div>
        <Link href="/publicar" style={{ backgroundColor: '#0253A3', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: '700', padding: '8px 14px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(2, 83, 163, 0.25)' }}>
          + Publicar
        </Link>
      </div>

      <div style={{ padding: '16px 20px' }}>
        
        {/* Buscador */}
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por palabra clave..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: '#1E293B', boxSizing: 'border-box' }}
          />
        </div>

        {/* Categorías en horizontal / chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px', scrollbarWidth: 'none' }}>
          {tiposAnimales.map((t) => (
            <button
              key={t.valor}
              onClick={() => setTipoFiltro(t.valor)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: tipoFiltro === t.valor ? '#0253A3' : '#E2E8F0',
                backgroundColor: tipoFiltro === t.valor ? '#EFF6FF' : '#FFFFFF',
                color: tipoFiltro === t.valor ? '#0253A3' : '#64748B',
                fontSize: '12px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Filtro Provincia */}
        <div style={{ marginBottom: '20px' }}>
          <select
            value={provinciaFiltro}
            onChange={(e) => setProvinciaFiltro(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '13px', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}>
            <option value="Todas">📍 Todas las provincias</option>
            {provincias.filter(p => p !== 'Todas').map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Lista de Publicaciones */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B', fontSize: '14px' }}>
            Cargando publicaciones...
          </div>
        ) : publicacionesFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🐷</div>
            <p style={{ fontSize: '14px', margin: 0, fontWeight: '600', color: '#475569' }}>No hay anuncios disponibles</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Intenta ajustar tus filtros de búsqueda.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {publicacionesFiltradas.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                
                {/* Imagen del Animal */}
                <div style={{ width: '100%', height: '210px', backgroundColor: '#F1F5F9', position: 'relative' }}>
                  {item.foto_url ? (
                    <img src={item.foto_url} alt={item.tipo_animal} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#CBD5E1' }}>
                      🐷
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backdropFilter: 'blur(4px)' }}>
                    📍 {item.provincia}
                  </div>
                </div>

                {/* Detalles del Anuncio */}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#0253A3', letterSpacing: '0.5px' }}>
                      {item.tipo_animal}
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#1E293B' }}>
                      RD$ {item.precio ? Number(item.precio).toLocaleString('es-DO') : '0'}
                    </span>
                  </div>

                  {item.peso && (
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px', fontWeight: '500' }}>
                      ⚖️ Peso aprox: <strong style={{ color: '#334155' }}>{item.peso} lbs</strong>
                    </div>
                  )}

                  <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 14px 0', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.descripcion}
                  </p>

                  {/* Acciones de Contacto */}
                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    <Link href={`/chat`} style={{ flex: 1, backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', color: '#0253A3', textDecoration: 'none', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      💬 Chat Privado
                    </Link>
                    {item.perfiles?.telefono && (
                      <a href={`https://wa.me/${item.perfiles.telefono.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, backgroundColor: '#25D366', color: 'white', textDecoration: 'none', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        💬 WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Barra de Navegación Inferior (Bottom Nav) */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '440px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-around', padding: '8px 0 12px 0', zIndex: 20 }}>
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#0253A3', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>🏠</span>
          Inicio
        </Link>
        <Link href="/directorio" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#64748B', fontSize: '11px', fontWeight: '500' }}>
          <span style={{ fontSize: '18px' }}>🏢</span>
          Directorio
        </Link>
        <Link href="/chat" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#64748B', fontSize: '11px', fontWeight: '500' }}>
          <span style={{ fontSize: '18px' }}>💬</span>
          Chat
        </Link>
        <Link href="/perfil" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#64748B', fontSize: '11px', fontWeight: '500' }}>
          <span style={{ fontSize: '18px' }}>👤</span>
          Perfil
        </Link>
      </div>

    </div>
  )
}