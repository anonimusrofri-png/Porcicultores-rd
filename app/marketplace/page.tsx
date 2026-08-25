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

const tiposAnimales = ['Todos', 'Lechon', 'Cerda', 'Varraco', 'Reproductor', 'Engorde']

export default function Marketplace() {
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
      .select('*, perfiles(id, nombre, provincia, whatsapp, telefono, foto_perfil)')
      .eq('activo', true)
      .eq('estado', 'aprobada')

    if (provincia !== 'Todas') query = query.eq('provincia', provincia)
    if (tipo !== 'Todos') query = query.eq('tipo_animal', tipo)

    const { data } = await query.order('created_at', { ascending: false })
    setPublicaciones(data || [])
    setCargando(false)
  }

  const filtradas = publicaciones.filter((p) => {
    if (!busqueda.trim()) return true
    const q = busqueda.toLowerCase()
    return (
      p.descripcion?.toLowerCase().includes(q) ||
      p.tipo_animal?.toLowerCase().includes(q) ||
      p.perfiles?.nombre?.toLowerCase().includes(q)
    )
  })

  const badgeStyle = (tipoStr: string) => {
    const t = tipoStr?.toLowerCase() || ''
    switch (t) {
      case 'lechon':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'cerda':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'verraco':
      case 'varraco':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'reproductor':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'engorde':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  if (!usuario && !cargando) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-slate-200">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Acceso exclusivo para miembros</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Crea una cuenta gratuita para ver las publicaciones y contactar vendedores.
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

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 font-sans bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-6 mb-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketplace Porcino</h1>
          <p className="text-blue-200 text-sm mt-1">
            República Dominicana • {filtradas.length} publicaciones
          </p>
        </div>
        <Link
          href="/publicar"
          className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm px-5 py-2.5 rounded-full transition-all shadow-md inline-flex items-center gap-1.5"
        >
          <span>+</span> Publicar
        </Link>
      </div>

      {/* Control Panel / Filters */}
      <div className="bg-white rounded-2xl p-4 md:p-5 mb-6 shadow-sm border border-slate-200 space-y-4">
        {/* Búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Buscar cerdos, lechones, vendedores..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        {/* Tipos */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tiposAnimales.map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                tipo === t
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t === 'Todos' ? 'Todos' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Provincias */}
        <div>
          <select
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            {provincias.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {cargando ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-5xl mb-3 animate-bounce">🐷</div>
          <p className="text-sm font-medium">Cargando publicaciones...</p>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="text-5xl mb-3">🐷</div>
          <p className="text-slate-700 font-semibold mb-2">No hay publicaciones disponibles</p>
          <p className="text-slate-500 text-sm mb-6">Sé el primero en publicar una oferta en el mercado.</p>
          <Link
            href="/publicar"
            className="inline-block bg-slate-900 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-md"
          >
            Sé el primero en publicar
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtradas.map((pub) => (
            <div
              key={pub.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-video bg-slate-100">
                {pub.foto_url ? (
                  <img
                    src={pub.foto_url}
                    alt="animal"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    🐷
                  </div>
                )}
                <span
                  className={`absolute top-3 right-3 border px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${badgeStyle(
                    pub.tipo_animal
                  )}`}
                >
                  {pub.tipo_animal}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <p className="text-blue-700 font-extrabold text-xl">
                      RD$ {pub.precio?.toLocaleString()}
                    </p>
                    {pub.peso && (
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-semibold">
                        {pub.peso} lbs
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 text-sm line-clamp-2 mb-3 leading-snug">
                    {pub.descripcion}
                  </p>
                  <p className="text-slate-500 text-xs mb-3 flex items-center gap-1">
                    📍 <span>{pub.provincia}</span>
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2.5 py-2.5 border-t border-slate-100 mb-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                      {pub.perfiles?.foto_perfil ? (
                        <img
                          src={pub.perfiles.foto_perfil}
                          alt="foto"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        pub.perfiles?.nombre?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <Link
                      href={`/usuario/${pub.perfiles?.id}`}
                      className="text-slate-900 font-semibold text-sm hover:underline truncate"
                    >
                      {pub.perfiles?.nombre || 'Usuario'}
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {pub.perfiles?.whatsapp && (
                      <a
                        href={`https://wa.me/1${pub.perfiles.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-center text-xs font-bold transition-all"
                      >
                        WhatsApp
                      </a>
                    )}
                    <Link
                      href={`/chat?usuario=${pub.perfiles?.id}`}
                      className={`bg-slate-900 hover:bg-slate-800 text-white py-2 px-3 rounded-xl text-center text-xs font-bold transition-all ${
                        !pub.perfiles?.whatsapp ? 'col-span-2' : ''
                      }`}
                    >
                      Mensaje
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}