'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = ['Todas','Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional','Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal','Independencia','La Altagracia','La Romana','La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná','San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís','Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde']

const tipos = ['Todos','comprador','vendedor','consumidor','transportista']

export default function BuscarUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [provincia, setProvincia] = useState('Todas')
  const [tipo, setTipo] = useState('Todos')
  const [cargando, setCargando] = useState(true)
  const [usuarioActual, setUsuarioActual] = useState<any>(null)

  useEffect(() => { cargarDatos() }, [provincia, tipo])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUsuarioActual(user)
    if (!user) { setCargando(false); return }
    let query = supabase.from('perfiles').select('*').neq('tipo', 'admin')
    if (provincia !== 'Todas') query = query.eq('provincia', provincia)
    if (tipo !== 'Todos') query = query.eq('tipo', tipo)
    const { data } = await query.order('nombre')
    setUsuarios(data || [])
    setCargando(false)
  }

  const usuariosFiltrados = usuarios.filter(u =>
    busqueda === '' || u.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (!usuarioActual && !cargando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '48px', maxWidth: '420px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Acceso exclusivo para miembros</h2>
        <p style={{ color: '#6B7280', marginBottom: '28px', fontSize: '14px' }}>Debes iniciar sesión para buscar usuarios.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/registro" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Crear Cuenta</Link>
          <Link href="/login" style={{ backgroundColor: '#F4F6F9', color: '#1A3C5E', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  )

  const iconoTipo = (t: string) => ({ comprador: '🛒', vendedor: '🐷', consumidor: '🍽️', transportista: '🚛' }[t] || '👤')

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '20px', fontFamily: "'Inter', sans-serif", backgroundColor: '#F4F6F9', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1A3C5E, #2563A8)', borderRadius: '16px', padding: '24px', marginBottom: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0' }}>Buscar Usuarios</h1>
          <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>Encuentra vendedores, transportistas y más</p>
        </div>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', textDecoration: 'none' }}>← Inicio</Link>
      </div>

      {/* Filtros */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
        <input placeholder="🔍 Buscar por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB', boxSizing: 'border-box', marginBottom: '12px', outline: 'none' }} />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {tipos.map(t => (
            <button key={t} onClick={() => setTipo(t)}
              style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', backgroundColor: tipo === t ? '#1A3C5E' : '#F3F4F6', color: tipo === t ? 'white' : '#374151' }}>
              {t === 'Todos' ? 'Todos' : iconoTipo(t) + ' ' + t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB' }}>
          {provincias.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Resultados */}
      {cargando ? (
        <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>Buscando usuarios...</p>
      ) : usuariosFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
          <p style={{ color: '#9CA3AF', fontWeight: '600' }}>No se encontraron usuarios</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {usuariosFiltrados.map(u => (
            <div key={u.id} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {/* Mini hero */}
              <div style={{ background: 'linear-gradient(135deg, #1A3C5E, #2563A8)', padding: '20px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: '#1A3C5E', margin: '0 auto 10px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.5)' }}>
                  {u.foto_perfil ? <img src={u.foto_perfil} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.nombre?.charAt(0).toUpperCase()}
                </div>
                <h3 style={{ color: 'white', fontWeight: '700', fontSize: '15px', margin: '0 0 4px 0' }}>{u.nombre}</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', margin: 0 }}>📍 {u.provincia}</p>
              </div>

              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                    {iconoTipo(u.tipo)} {u.tipo}
                  </span>
                  {u.verificado && <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>✅ Verificado</span>}
                </div>

                <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                  {[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= Math.round(u.estrellas || 0) ? '#F59E0B' : '#E5E7EB', fontSize: '14px' }}>★</span>)}
                  <span style={{ color: '#6B7280', fontSize: '12px', marginLeft: '4px' }}>({u.estrellas || 0})</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Link href={`/usuario/${u.id}`}
                    style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '9px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>
                    Ver Perfil
                  </Link>
                  {u.whatsapp && (
                    <a href={`https://wa.me/1${u.whatsapp.replace(/\D/g,'')}`} target="_blank"
                      style={{ backgroundColor: '#25D366', color: 'white', padding: '9px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '12px', marginTop: '24px' }}>
        {usuariosFiltrados.length} usuario{usuariosFiltrados.length !== 1 ? 's' : ''} encontrado{usuariosFiltrados.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}