'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = ['Todas','Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional','Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal','Independencia','La Altagracia','La Romana','La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná','San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís','Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde']
const categorias = ['Todas','veterinaria','farmacia_veterinaria','tienda_alimento','transportista','servicio_porcino']

export default function Directorio() {
  const [negocios, setNegocios] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [provincia, setProvincia] = useState('Todas')
  const [categoria, setCategoria] = useState('Todas')
  const [cargando, setCargando] = useState(true)

  useEffect(() => { cargarDatos() }, [provincia, categoria])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)
    if (!user) { setCargando(false); return }
    let query = supabase.from('directorio').select('*')
    if (provincia !== 'Todas') query = query.eq('provincia', provincia)
    if (categoria !== 'Todas') query = query.eq('categoria', categoria)
    const { data } = await query.order('nombre')
    setNegocios(data || [])
    setCargando(false)
  }

  if (!usuario && !cargando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '48px', maxWidth: '480px', textAlign: 'center' }}>
        <h2 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Acceso exclusivo para miembros</h2>
        <p style={{ color: '#64748b', marginBottom: '28px' }}>Debes iniciar sesion para ver el directorio.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/registro" style={{ backgroundColor: '#0a2463', color: 'white', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>Crear Cuenta</Link>
          <Link href="/login" style={{ backgroundColor: '#f0f4f8', color: '#0a2463', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>Iniciar Sesion</Link>
        </div>
      </div>
    </div>
  )

  const labelCategoria = (c: string) => ({ veterinaria: 'Veterinaria', farmacia_veterinaria: 'Farmacia Veterinaria', tienda_alimento: 'Tienda de Alimento', transportista: 'Transportista', servicio_porcino: 'Servicio Porcino' }[c] || c)

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900', margin: 0 }}>Directorio Porcino</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white' }}>
          {provincias.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white' }}>
          {categorias.map(c => <option key={c} value={c}>{labelCategoria(c)}</option>)}
        </select>
      </div>
      {cargando ? <p style={{ color: '#64748b' }}>Cargando directorio...</p> : negocios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#94a3b8' }}>No hay negocios en esta categoria o provincia</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {negocios.map((neg) => (
            <div key={neg.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ color: '#0a2463', fontWeight: '800', fontSize: '16px', margin: 0 }}>{neg.nombre}</h3>
                {neg.verificado && <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>✓ Verificado</span>}
              </div>
              <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block', marginBottom: '10px' }}>{labelCategoria(neg.categoria)}</span>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px 0' }}>📍 {neg.provincia}</p>
              {neg.direccion && <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px 0' }}>{neg.direccion}</p>}
              {neg.descripcion && <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 12px 0', lineHeight: 1.5 }}>{neg.descripcion}</p>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {neg.whatsapp && <a href={`https://wa.me/1${neg.whatsapp.replace(/\D/g,'')}`} target="_blank" style={{ flex: 1, backgroundColor: '#25d366', color: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>WhatsApp</a>}
                {neg.telefono && <a href={`tel:${neg.telefono}`} style={{ flex: 1, backgroundColor: '#0a2463', color: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>Llamar</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}