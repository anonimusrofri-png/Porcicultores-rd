'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = [
  'Todas', 'Azua', 'Bahoruco', 'Barahona', 'Dajabón', 'Distrito Nacional', 'Duarte', 'Elías Piña', 
  'El Seibo', 'Espaillat', 'Hato Mayor', 'Hermanas Mirabal', 'Independencia', 'La Altagracia', 
  'La Romana', 'La Vega', 'María Trinidad Sánchez', 'Monseñor Nouel', 'Monte Cristi', 
  'Monte Plata', 'Pedernales', 'Peravia', 'Puerto Plata', 'Samaná', 'San Cristóbal', 
  'San José de Ocoa', 'San Juan', 'San Pedro de Macorís', 'Sánchez Ramírez', 'Santiago', 
  'Santiago Rodríguez', 'Santo Domingo', 'Valverde'
]

const categorias = [
  'Todas',
  'Granja Porcina',
  'Alimentos y Nutrición',
  'Veterinaria y Medicina',
  'Equipos e Insumos',
  'Transporte y Logística'
]

export default function Directorio() {
  const [negocios, setNegocios] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [provinciaFiltro, setProvinciaFiltro] = useState('Todas')
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas')

  useEffect(() => {
    cargarDirectorio()
  }, [])

  const cargarDirectorio = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('directorio')
      .select('*')
      .order('nombre', { ascending: true })

    if (error) {
      console.error('Error cargando directorio:', error.message)
    } else {
      setNegocios(data || [])
    }
    setCargando(false)
  }

  // Filtrado de la lista
  const negociosFiltrados = negocios.filter((n) => {
    const coincideBusqueda = n.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                            n.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
    const coincideProvincia = provinciaFiltro === 'Todas' || n.provincia === provinciaFiltro
    const coincideCategoria = categoriaFiltro === 'Todas' || n.categoria === categoriaFiltro

    return coincideBusqueda && coincideProvincia && coincideCategoria
  })

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', fontFamily: "'Inter', sans-serif", backgroundColor: '#FFFFFF', minHeight: '100vh', boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>

      {/* Encabezado Principal */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', margin: 0 }}>Directorio Porcino</h1>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>Granjas, alimentos y servicios en RD</p>
        </div>
        <Link href="/" style={{ color: '#0253A3', textDecoration: 'none', fontSize: '13px', fontWeight: '600', backgroundColor: '#EFF6FF', padding: '6px 12px', borderRadius: '20px' }}>
          ← Inicio
        </Link>
      </div>

      <div style={{ padding: '16px 20px' }}>

        {/* Buscador de Texto */}
        <div style={{ marginBottom: '14px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o servicio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: '#1E293B', boxSizing: 'border-box' }}
          />
        </div>

        {/* Filtros Dropdown (Provincia y Categoría) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Provincia</label>
            <select
              value={provinciaFiltro}
              onChange={(e) => setProvinciaFiltro(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '13px', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}>
              {provincias.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Categoría</label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '13px', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Carga o Resultados */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B', fontSize: '14px' }}>
            Cargando directorio...
          </div>
        ) : negociosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏢</div>
            <p style={{ fontSize: '14px', margin: 0, fontWeight: '600', color: '#475569' }}>No se encontraron negocios</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Prueba cambiando los filtros de búsqueda.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {negociosFiltrados.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B', margin: 0 }}>{item.nombre}</h3>
                  {item.categoria && (
                    <span style={{ backgroundColor: '#EFF6FF', color: '#0253A3', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '12px' }}>
                      {item.categoria}
                    </span>
                  )}
                </div>

                <p style={{ color: '#64748B', fontSize: '12px', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>📍</span> {item.provincia || 'República Dominicana'}
                </p>

                {item.descripcion && (
                  <p style={{ color: '#334155', fontSize: '13px', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                    {item.descripcion}
                  </p>
                )}

                {/* Acciones de Contacto */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px', marginTop: '4px' }}>
                  {item.telefono && (
                    <a href={`tel:${item.telefono}`} style={{ flex: 1, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1E293B', textDecoration: 'none', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      📞 Llamar
                    </a>
                  )}
                  {item.whatsapp && (
                    <a href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, backgroundColor: '#25D366', color: 'white', textDecoration: 'none', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      💬 WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}