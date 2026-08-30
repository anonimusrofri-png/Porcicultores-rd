'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [publicaciones, setPublicaciones] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todos')
  const [provincia, setProvincia] = useState('Todas')

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

  const publicacionesFiltradas = publicaciones.filter((pub) => {
    const coincideBusqueda =
      pub.tipo_animal.toLowerCase().includes(busqueda.toLowerCase()) ||
      pub.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      pub.provincia.toLowerCase().includes(busqueda.toLowerCase())

    const coincideCategoria =
      categoria === 'Todos' || pub.tipo_animal.toLowerCase() === categoria.toLowerCase()

    const coincideProvincia =
      provincia === 'Todas' || pub.provincia.toLowerCase() === provincia.toLowerCase()

    return coincideBusqueda && coincideCategoria && coincideProvincia
  })

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', fontFamily: "'Inter', sans-serif", backgroundColor: '#FFFFFF', minHeight: '100vh', boxShadow: '0 0 20px rgba(0,0,0,0.05)', paddingBottom: '80px' }}>

      {/* Encabezado Principal */}
      <div style={{ backgroundColor: '#0253A3', padding: '20px', color: 'white', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Marketplace Porcino</h1>
            <p style={{ fontSize: '12px', opacity: 0.9, margin: '4px 0 0 0' }}>
              República Dominicana • {publicacionesFiltradas.length} publicaciones
            </p>
          </div>
          <Link href="/publicar" style={{ backgroundColor: 'white', color: '#0253A3', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>
            + Publicar
          </Link>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>

        {/* Buscador */}
        <div style={{ marginBottom: '14px' }}>
          <input
            type="text"
            placeholder="Buscar cerdos, lechones, vendedores..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Filtro por Categorías */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px', scrollbarWidth: 'none' }}>
          {['Todos', 'Cerdo', 'Lechon', 'Cerda', 'Verraco', 'Reproductor', 'Engorde'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: categoria === cat ? '#0253A3' : '#F1F5F9',
                color: categoria === cat ? 'white' : '#475569',
                fontSize: '12px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Filtro por Provincia */}
        <div style={{ marginBottom: '16px' }}>
          <select
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '13px', color: '#334155', outline: 'none' }}>
            <option value="Todas">Todas las provincias</option>
            <option value="Santiago">Santiago</option>
            <option value="La Vega">La Vega</option>
            <option value="Espaillat">Espaillat (Moca)</option>
            <option value="Santo Domingo">Santo Domingo</option>
            <option value="Dajabón">Dajabón</option>
            <option value="Monte Plata">Monte Plata</option>
          </select>
        </div>

        {/* Estado Vacío / Sin Publicaciones */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B', fontSize: '14px' }}>
            Cargando publicaciones...
          </div>
        ) : publicacionesFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', margin: '20px 0' }}>
            <p style={{ fontSize: '15px', color: '#64748B', fontWeight: '600', margin: '0 0 16px 0' }}>
              No hay publicaciones disponibles
            </p>
            <Link href="/publicar" style={{ backgroundColor: '#0253A3', color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', display: 'inline-block' }}>
              Sé el primero en publicar
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {publicacionesFiltradas.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                
                {/* Imagen */}
                <div style={{ width: '100%', height: '180px', backgroundColor: '#F1F5F9', position: 'relative' }}>
                  {item.foto_url ? (
                    <img src={item.foto_url} alt={item.tipo_animal} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '13px' }}>
                      Sin imagen
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(30, 41, 59, 0.8)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
                    {item.provincia}
                  </div>
                </div>

                {/* Detalles */}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#0253A3' }}>
                      {item.tipo_animal}
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#1E293B' }}>
                      RD$ {item.precio ? Number(item.precio).toLocaleString('es-DO') : '0'}
                    </span>
                  </div>

                  {item.peso && (
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                      Peso: {item.peso} lbs
                    </div>
                  )}

                  <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                    {item.descripcion}
                  </p>

                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>
                      {item.perfiles?.nombre || 'Vendedor'}
                    </span>
                    {item.perfiles?.telefono && (
                      <a href={`https://wa.me/809${item.perfiles.telefono.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ backgroundColor: '#25D366', color: 'white', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                        Contactar
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Barra de Navegación Inferior */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '440px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-around', padding: '10px 0 12px 0', zIndex: 20 }}>
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#0253A3', fontSize: '11px', fontWeight: '700' }}>
          Inicio
        </Link>
        <Link href="/directorio" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#64748B', fontSize: '11px', fontWeight: '500' }}>
          Directorio
        </Link>
        <Link href="/chat" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#64748B', fontSize: '11px', fontWeight: '500' }}>
          Chat
        </Link>
        <Link href="/perfil" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#64748B', fontSize: '11px', fontWeight: '500' }}>
          Perfil
        </Link>
      </div>

    </div>
  )
}