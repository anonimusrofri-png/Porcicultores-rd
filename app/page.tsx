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
      pub.tipo_animal?.toLowerCase().includes(busqueda.toLowerCase()) ||
      pub.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      pub.provincia?.toLowerCase().includes(busqueda.toLowerCase())

    const coincideCategoria =
      categoria === 'Todos' || pub.tipo_animal?.toLowerCase() === categoria.toLowerCase()

    const coincideProvincia =
      provincia === 'Todas' || pub.provincia?.toLowerCase() === provincia.toLowerCase()

    return coincideBusqueda && coincideCategoria && coincideProvincia
  })

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen bg-white font-sans pb-24 md:pb-12">

      {/* Encabezado Principal */}
      <div className="bg-[#0253A3] p-5 md:p-8 text-white rounded-b-2xl md:rounded-2xl md:mt-4 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-3xl font-extrabold m-0">Marketplace Porcino</h1>
            <p className="text-xs md:text-sm opacity-90 mt-1">
              República Dominicana • {publicacionesFiltradas.length} publicaciones
            </p>
          </div>
          <Link 
            href="/publicar" 
            className="bg-white text-[#0253A3] hover:bg-slate-100 px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all shadow-sm"
          >
            + Publicar
          </Link>
        </div>
      </div>

      <div className="p-4 md:p-6">

        {/* Buscador */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Buscar cerdos, lechones, vendedores..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-[#0253A3] focus:bg-white transition-all"
          />
        </div>

        {/* Filtro por Categorías */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {['Todos', 'Cerdo', 'Lechon', 'Cerda', 'Verraco', 'Reproductor', 'Engorde'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoria === cat 
                  ? 'bg-[#0253A3] text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtro por Provincia */}
        <div className="mb-6">
          <select
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#0253A3]"
          >
            <option value="Todas">Todas las provincias</option>
            <option value="Santiago">Santiago</option>
            <option value="La Vega">La Vega</option>
            <option value="Espaillat">Espaillat (Moca)</option>
            <option value="Santo Domingo">Santo Domingo</option>
            <option value="Dajabón">Dajabón</option>
            <option value="Monte Plata">Monte Plata</option>
            <option value="Valverde">Valverde</option>
          </select>
        </div>

        {/* Estado Vacío / Lista de Publicaciones */}
        {cargando ? (
          <div className="text-center py-16 text-slate-500 text-sm font-medium">
            <div className="text-4xl mb-2 animate-bounce">🐷</div>
            Cargando publicaciones...
          </div>
        ) : publicacionesFiltradas.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 my-6 shadow-sm">
            <div className="text-4xl mb-2">🐷</div>
            <p className="text-base text-slate-600 font-semibold mb-4">
              No hay publicaciones disponibles
            </p>
            <Link 
              href="/publicar" 
              className="bg-[#0253A3] hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-block transition-all shadow-md"
            >
              Sé el primero en publicar
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publicacionesFiltradas.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                
                <div>
                  {/* Imagen */}
                  <div className="w-full h-48 bg-slate-100 relative">
                    {item.foto_url ? (
                      <img src={item.foto_url} alt={item.tipo_animal} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        Sin imagen
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-slate-900/80 text-white px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm">
                      📍 {item.provincia}
                    </div>
                  </div>

                  {/* Detalles */}
                  <div className="p-4">
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0253A3]">
                        {item.tipo_animal}
                      </span>
                      <span className="text-lg font-extrabold text-slate-900">
                        RD$ {item.precio ? Number(item.precio).toLocaleString('es-DO') : '0'}
                      </span>
                    </div>

                    {item.peso && (
                      <div className="text-xs text-slate-500 mb-2 font-medium">
                        Peso: {item.peso} lbs
                      </div>
                    )}

                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {item.descripcion}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 border-t border-slate-100 pt-3 flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-semibold truncate max-w-[150px]">
                    {item.perfiles?.nombre || 'Vendedor'}
                  </span>
                  {item.perfiles?.telefono && (
                    <a 
                      href={`https://wa.me/1${item.perfiles.telefono.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="bg-[#25D366] hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    >
                      Contactar
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Barra de Navegación Inferior en Móviles */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 z-30 shadow-lg">
        <Link href="/" className="flex flex-col items-center text-[#0253A3] text-[11px] font-bold">
          Inicio
        </Link>
        <Link href="/directorio" className="flex flex-col items-center text-slate-500 text-[11px] font-medium">
          Directorio
        </Link>
        <Link href="/chat" className="flex flex-col items-center text-slate-500 text-[11px] font-medium">
          Chat
        </Link>
        <Link href="/perfil" className="flex flex-col items-center text-slate-500 text-[11px] font-medium">
          Perfil
        </Link>
      </div>

    </div>
  )
}