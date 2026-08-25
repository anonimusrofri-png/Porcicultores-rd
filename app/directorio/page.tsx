'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

interface Negocio {
  id: string
  nombre: string
  categoria: string
  descripcion: string
  provincia: string
  telefono: string
  whatsapp: string
  direccion?: string
  imagen_url?: string
}

export default function Directorio() {
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDirectorio()
  }, [])

  const cargarDirectorio = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('directorio')
      .select('*')
      .order('nombre', { ascending: true })

    if (!error && data) {
      setNegocios(data)
    }
    setCargando(false)
  }

  const negociosFiltrados = negocios.filter((n) => {
    const coincideBusqueda =
      n.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      n.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      n.provincia?.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = categoria === 'Todas' || n.categoria === categoria
    return coincideBusqueda && coincideCategoria
  })

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Directorio Porcino RD
          </h1>
          <p className="text-slate-600 text-sm">
            Encuentra granjas, suplidores de alimento, servicios veterinarios y comercios del sector.
          </p>
        </div>

        {/* Call to Action Banner con WhatsApp listo */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-emerald-900 text-white rounded-2xl p-6 md:p-8 text-center shadow-lg mb-8 border border-emerald-800/30">
          <h2 className="text-lg md:text-xl font-bold mb-2">
            ¿Tienes un negocio relacionado al sector porcino?
          </h2>
          <p className="text-slate-300 text-xs md:text-sm mb-5">
            Contacta al administrador para inscribir tu negocio en el directorio.
          </p>
          <a
            href="https://wa.me/18098373120?text=Hola,%20me%20interesa%20inscribir%20mi%20negocio%20en%20el%20directorio%20porcino."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:scale-[1.02]"
          >
            Contactar por WhatsApp
          </a>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o provincia..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
          >
            <option value="Todas">Todas las categorías</option>
            <option value="Granja">Granjas</option>
            <option value="Alimentos">Alimentos y Nutrición</option>
            <option value="Veterinaria">Veterinarias y Medicamentos</option>
            <option value="Equipos">Equipos y Maquinaria</option>
            <option value="Transporte">Transporte</option>
          </select>
        </div>

        {/* Listado */}
        {cargando ? (
          <div className="text-center py-12 text-slate-500 text-sm">Cargando directorio...</div>
        ) : negociosFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-sm">
            No se encontraron negocios con esos criterios.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {negociosFiltrados.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-lg mb-3">
                    {item.categoria}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{item.nombre}</h3>
                  <p className="text-xs text-slate-500 mb-3">📍 {item.provincia}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.descripcion}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-2">
                  {item.whatsapp && (
                    <a
                      href={`https://wa.me/1${item.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all"
                    >
                      WhatsApp
                    </a>
                  )}
                  {item.telefono && (
                    <a
                      href={`tel:${item.telefono}`}
                      className="flex-1 py-2 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-all"
                    >
                      Llamar
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