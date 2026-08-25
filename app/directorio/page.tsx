'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = [
  'Todas', 'Azua', 'Bahoruco', 'Barahona', 'Dajabón', 'Distrito Nacional', 'Duarte',
  'Elías Piña', 'El Seibo', 'Espaillat', 'Hato Mayor', 'Hermanas Mirabal', 'Independencia',
  'La Altagracia', 'La Romana', 'La Vega', 'María Trinidad Sánchez', 'Monseñor Nouel',
  'Monte Cristi', 'Monte Plata', 'Pedernales', 'Peravia', 'Puerto Plata', 'Samaná',
  'San Cristóbal', 'San José de Ocoa', 'San Juan', 'San Pedro de Macorís', 'Sánchez Ramírez',
  'Santiago', 'Santiago Rodríguez', 'Santo Domingo', 'Valverde'
]

const categorias = ['Todas', 'veterinaria', 'farmacia_veterinaria', 'tienda_alimento', 'transportista', 'servicio_porcino']

const labelCategoria = (c: string) =>
  ({
    veterinaria: 'Veterinaria',
    farmacia_veterinaria: 'Farmacia Veterinaria',
    tienda_alimento: 'Tienda de Alimento',
    transportista: 'Transportista',
    servicio_porcino: 'Servicio Porcino',
  }[c] || c)

const iconoCategoria = (c: string) =>
  ({
    veterinaria: '🏥',
    farmacia_veterinaria: '💊',
    tienda_alimento: '🌽',
    transportista: '🚛',
    servicio_porcino: '🐷',
  }[c] || '📋')

export default function Directorio() {
  const [negocios, setNegocios] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [provincia, setProvincia] = useState('Todas')
  const [categoria, setCategoria] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({
    nombre: '',
    categoria: 'veterinaria',
    provincia: '',
    telefono: '',
    whatsapp: '',
    direccion: '',
    descripcion: '',
  })

  useEffect(() => {
    cargarDatos()
  }, [provincia, categoria])

  const cargarDatos = async () => {
    setCargando(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUsuario(user)

    if (user) {
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('es_admin, tipo')
        .eq('id', user.id)
        .single()

      // Reconocimiento directo de administrador sin contraseñas:
      const esAdminUser =
        user.email === 'anonimusrofri@gmail.com' ||
        perfil?.es_admin === true ||
        perfil?.tipo === 'admin'

      setEsAdmin(esAdminUser)
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
    setForm({
      nombre: '',
      categoria: 'veterinaria',
      provincia: '',
      telefono: '',
      whatsapp: '',
      direccion: '',
      descripcion: '',
    })
    setMostrarFormulario(false)
    setGuardando(false)
    cargarDatos()
  }

  const eliminarNegocio = async (id: string) => {
    if (!confirm('¿Eliminar este negocio del directorio?')) return
    await supabase.from('directorio').delete().eq('id', id)
    cargarDatos()
  }

  if (!usuario && !cargando) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-slate-200">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Acceso exclusivo para miembros</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Debes iniciar sesión para ver el directorio.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/registro"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Crear Cuenta
            </Link>
            <Link
              href="/login"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const negociosFiltrados = negocios.filter((n) => {
    if (!busqueda.trim()) return true
    const q = busqueda.toLowerCase()
    return (
      n.nombre?.toLowerCase().includes(q) ||
      n.descripcion?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-6 mb-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Directorio Porcino</h1>
          <p className="text-blue-200 text-sm mt-1">
            Servicios especializados en República Dominicana
          </p>
        </div>
        <Link href="/" className="text-blue-200 hover:text-white text-xs font-semibold transition-all">
          ← Inicio
        </Link>
      </div>

      {/* Botón Administrador */}
      {esAdmin && (
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition-all mb-4 flex items-center justify-center gap-2"
        >
          {mostrarFormulario ? '✕ Cancelar' : '+ Agregar Negocio al Directorio'}
        </button>
      )}

      {/* Formulario Administrador */}
      {esAdmin && mostrarFormulario && (
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-slate-900 font-bold text-base mb-4">Nuevo Negocio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre *</label>
              <input
                type="text"
                placeholder="Nombre del negocio"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
              <input
                type="tel"
                placeholder="809-000-0000"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp</label>
              <input
                type="tel"
                placeholder="809-000-0000"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección</label>
              <input
                type="text"
                placeholder="Dirección física"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {categorias.filter((c) => c !== 'Todas').map((c) => (
                  <option key={c} value={c}>
                    {labelCategoria(c)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Provincia *</label>
              <select
                value={form.provincia}
                onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">Selecciona...</option>
                {provincias.filter((p) => p !== 'Todas').map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
            <textarea
              placeholder="Descripción del negocio..."
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y"
            />
          </div>
          <button
            onClick={agregarNegocio}
            disabled={guardando}
            className="mt-4 py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md transition-all"
          >
            {guardando ? 'Guardando...' : '✓ Guardar Negocio'}
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-4 md:p-5 mb-6 shadow-sm border border-slate-200 space-y-3">
        <input
          type="text"
          placeholder="🔍 Buscar veterinarias, alimento, servicios..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                categoria === c
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c === 'Todas' ? 'Todos' : labelCategoria(c)}
            </button>
          ))}
        </div>
        <select
          value={provincia}
          onChange={(e) => setProvincia(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          {provincias.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de Negocios */}
      {cargando ? (
        <p className="text-center text-slate-500 py-12 text-sm">Cargando directorio...</p>
      ) : negociosFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-slate-700 font-semibold mb-1">No hay negocios en esta categoría o provincia</p>
          {esAdmin && (
            <p className="text-slate-500 text-xs">Agrega el primero usando el botón de arriba</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {negociosFiltrados.map((neg) => (
            <div
              key={neg.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-2xl flex items-center justify-center shrink-0 border border-blue-100">
                      {iconoCategoria(neg.categoria)}
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-bold text-base leading-tight">
                        {neg.nombre}
                      </h3>
                      <span className="text-blue-700 text-xs font-semibold">
                        {labelCategoria(neg.categoria)}
                      </span>
                    </div>
                  </div>
                  {neg.verificado && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      ✅ Verificado
                    </span>
                  )}
                </div>

                <p className="text-slate-500 text-xs mb-1">📍 {neg.provincia}</p>
                {neg.direccion && <p className="text-slate-500 text-xs mb-1">📌 {neg.direccion}</p>}
                {neg.descripcion && (
                  <p className="text-slate-700 text-xs leading-relaxed my-2">{neg.descripcion}</p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 mt-3 flex gap-2">
                {neg.whatsapp && (
                  <a
                    href={`https://wa.me/1${neg.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-center text-xs font-bold transition-all"
                  >
                    WhatsApp
                  </a>
                )}
                {neg.telefono && (
                  <a
                    href={`tel:${neg.telefono}`}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 py-2 rounded-xl text-center text-xs font-bold transition-all"
                  >
                    Llamar
                  </a>
                )}
                {esAdmin && (
                  <button
                    onClick={() => eliminarNegocio(neg.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 rounded-xl text-xs font-bold transition-all"
                    title="Eliminar negocio"
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner de Inscripción */}
      {!esAdmin && (
        <div className="bg-gradient-to-r from-slate-900 to-emerald-900 rounded-2xl p-6 mt-6 text-white text-center shadow-lg">
          <h3 className="font-bold text-base mb-1">¿Tienes un negocio relacionado al sector porcino?</h3>
          <p className="text-emerald-100 text-xs mb-4">
            Contacta al administrador para inscribir tu negocio en el directorio.
          </p>
          <a
            href="https://wa.me/18093708359"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-slate-900 font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-slate-100 transition-all shadow-md"
          >
            Contactar por WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}