'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = ['Todas','Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional','Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal','Independencia','La Altagracia','La Romana','La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná','San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís','Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde']
const categorias = ['Todas','veterinaria','farmacia_veterinaria','tienda_alimento','transportista','servicio_porcino']

const labelCategoria = (c: string) => ({
  veterinaria: 'Veterinaria',
  farmacia_veterinaria: 'Farmacia Veterinaria',
  tienda_alimento: 'Tienda de Alimento',
  transportista: 'Transportista',
  servicio_porcino: 'Servicio Porcino'
}[c] || c)

const iconoCategoria = (c: string) => ({
  veterinaria: '🏥',
  farmacia_veterinaria: '💊',
  tienda_alimento: '🌽',
  transportista: '🚛',
  servicio_porcino: '🐷'
}[c] || '📋')

export default function Directorio() {
  const [negocios, setNegocios] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [provincia, setProvincia] = useState('Todas')
  const [categoria, setCategoria] = useState('Todas')
  const [busqueda, setBusqueda] = useState('Todas')
  const [cargando, setCargando] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({ nombre: '', categoria: 'veterinaria', provincia: '', telefono: '', whatsapp: '', direccion: '', descripcion: '' })

  useEffect(() => { cargarDatos() }, [provincia, categoria])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)
    if (user) {
      const { data: perfil } = await supabase.from('perfiles').select('es_admin, tipo').eq('id', user.id).single()
      setEsAdmin(perfil?.es_admin === true || perfil?.tipo === 'admin')
    }
    let query = supabase.from('directorio').select('*')
    if (provincia !== 'Todas') query = query.eq('provincia', provincia)
    if (categoria !== 'Todas') query = query.eq('categoria', categoria)
    const { data } = await query.order('nombre')
    setNegocios(data || [])
    setCargando(false)
  }

  const agregarNegocio = async () => {
    if (!form.nombre || !form.provincia) return
    setGuardando(true)
    await supabase.from('directorio').insert({ ...form })
    setForm({ nombre: '', categoria: 'veterinaria', provincia: '', telefono: '', whatsapp: '', direccion: '', descripcion: '' })
    setMostrarFormulario(false)
    setGuardando(false)
    cargarDatos()
  }

  const eliminarNegocio = async (id: string) => {
    if (!confirm('¿Eliminar este negocio del directorio?')) return
    await supabase.from('directorio').delete().eq('id', id)
    cargarDatos()
  }

  if (!usuario && !cargando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '48px', maxWidth: '480px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ color: '#1A3C5E', fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>Acceso exclusivo para miembros</h2>
        <p style={{ color: '#6B7280', marginBottom: '28px' }}>Debes iniciar sesión para ver el directorio.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/registro" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>Crear Cuenta</Link>
          <Link href="/login" style={{ backgroundColor: '#F4F6F9', color: '#1A3C5E', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: "'Inter', sans-serif", backgroundColor: '#F4F6F9', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1A3C5E, #2563A8)', borderRadius: '16px', padding: '24px', marginBottom: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0' }}>Directorio Porcino</h1>
          <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>Servicios especializados en República Dominicana</p>
        </div>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', textDecoration: 'none' }}>← Inicio</Link>
      </div>

      {/* Botón agregar — solo admin */}
      {esAdmin && (
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>
          {mostrarFormulario ? '✕ Cancelar' : '+ Agregar Negocio al Directorio'}
        </button>
      )}

      {/* Formulario agregar — solo admin */}
      {esAdmin && mostrarFormulario && (
        <div style={{ backgroundColor: 'white', border: '1px solid #BBF7D0', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ color: '#1A3C5E', fontWeight: '700', margin: '0 0 16px 0' }}>Nuevo Negocio</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Nombre *', key: 'nombre', type: 'text', placeholder: 'Nombre del negocio' },
              { label: 'Teléfono', key: 'telefono', type: 'tel', placeholder: '809-000-0000' },
              { label: 'WhatsApp', key: 'whatsapp', type: 'tel', placeholder: '809-000-0000' },
              { label: 'Dirección', key: 'direccion', type: 'text', placeholder: 'Dirección física' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#F9FAFB' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Categoría</label>
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB' }}>
                {categorias.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{labelCategoria(c)}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Provincia *</label>
              <select value={form.provincia} onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB' }}>
                <option value="">Selecciona...</option>
                {provincias.filter(p => p !== 'Todas').map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Descripción</label>
            <textarea placeholder="Descripción del negocio..." value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#F9FAFB', resize: 'vertical' }} />
          </div>
          <button onClick={agregarNegocio} disabled={guardando}
            style={{ marginTop: '16px', padding: '12px 28px', background: 'linear-gradient(135deg, #1A3C5E, #2563A8)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
            {guardando ? 'Guardando...' : '✓ Guardar Negocio'}
          </button>
        </div>
      )}

      {/* Filtros */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
        <input placeholder="🔍 Buscar veterinarias, alimento, servicios..." value={busqueda === 'Todas' ? '' : busqueda}
          onChange={(e) => setBusqueda(e.target.value || 'Todas')}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB', boxSizing: 'border-box', marginBottom: '12px' }} />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {['Todas', 'veterinaria', 'farmacia_veterinaria', 'tienda_alimento', 'transportista', 'servicio_porcino'].map(c => (
            <button key={c} onClick={() => setCategoria(c)}
              style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', backgroundColor: categoria === c ? '#1A3C5E' : '#F3F4F6', color: categoria === c ? 'white' : '#374151' }}>
              {c === 'Todas' ? 'Todos' : labelCategoria(c)}
            </button>
          ))}
        </div>
        <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB' }}>
          {provincias.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Lista */}
      {cargando ? (
        <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>Cargando directorio...</p>
      ) : negocios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
          <p style={{ color: '#9CA3AF', fontWeight: '600' }}>No hay negocios en esta categoría o provincia</p>
          {esAdmin && <p style={{ color: '#6B7280', fontSize: '13px' }}>Agrega el primero usando el botón de arriba</p>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {negocios.filter(n => busqueda === 'Todas' || n.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || n.descripcion?.toLowerCase().includes(busqueda.toLowerCase())).map((neg) => (
            <div key={neg.id} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                    {iconoCategoria(neg.categoria)}
                  </div>
                  <div>
                    <h3 style={{ color: '#111827', fontWeight: '600', fontSize: '15px', margin: 0 }}>{neg.nombre}</h3>
                    <span style={{ color: '#2563A8', fontSize: '11px', fontWeight: '600' }}>{labelCategoria(neg.categoria)}</span>
                  </div>
                </div>
                {neg.verificado && <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>✅ Verificado</span>}
              </div>
              <p style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 4px 0' }}>📍 {neg.provincia}</p>
              {neg.direccion && <p style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 4px 0' }}>📌 {neg.direccion}</p>}
              {neg.descripcion && <p style={{ color: '#374151', fontSize: '13px', margin: '0 0 12px 0', lineHeight: 1.5 }}>{neg.descripcion}</p>}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '12px', display: 'flex', gap: '8px' }}>
                {neg.whatsapp && <a href={`https://wa.me/1${neg.whatsapp.replace(/\D/g,'')}`} target="_blank" style={{ flex: 1, backgroundColor: '#1A3C5E', color: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>WhatsApp</a>}
                {neg.telefono && <a href={`tel:${neg.telefono}`} style={{ flex: 1, backgroundColor: '#F3F4F6', color: '#374151', padding: '10px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '600', border: '1px solid #E5E7EB' }}>Llamar</a>}
                {esAdmin && (
                  <button onClick={() => eliminarNegocio(neg.id)}
                    style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                    🗑
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner inscripción — solo para no admin */}
      {!esAdmin && (
        <div style={{ background: 'linear-gradient(135deg, #1A3C5E, #1B5E20)', borderRadius: '16px', padding: '24px', marginTop: '24px', color: 'white', textAlign: 'center' }}>
          <h3 style={{ fontWeight: '700', margin: '0 0 8px 0' }}>¿Tienes un negocio relacionado al sector porcino?</h3>
          <p style={{ opacity: 0.8, fontSize: '13px', margin: '0 0 16px 0' }}>Contacta al administrador para inscribir tu negocio en el directorio.</p>
          <a href="https://wa.me/18095550000" target="_blank"
            style={{ backgroundColor: 'white', color: '#1A3C5E', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
            Contactar por WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}