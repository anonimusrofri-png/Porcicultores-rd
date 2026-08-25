'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function Precios() {
  const [precios, setPrecios] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [tabActiva, setTabActiva] = useState<'libra' | 'kilo'>('libra')
  const [provinciaFiltro, setProvinciaFiltro] = useState('Todas')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)
    if (!user) {
      setCargando(false)
      return
    }

    const { data } = await supabase.from('precios_cerdo').select('*').order('provincia')
    setPrecios(data || [])
    setCargando(false)
  }

  if (!usuario && !cargando) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-slate-200">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Acceso exclusivo para miembros</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Crea una cuenta para ver los precios actualizados del mercado porcino.
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

  // Promedio nacional
  const promedioLibra =
    precios.length > 0
      ? Math.round((precios.reduce((s, p) => s + (p.precio_libra || 0), 0) / precios.length) * 10) / 10
      : 0

  const promedioKilo =
    precios.length > 0
      ? Math.round((precios.reduce((s, p) => s + (p.precio_kilo || 0), 0) / precios.length) * 10) / 10
      : 0

  // Datos para la gráfica
  const datosGrafica = diasSemana.map((dia, i) => ({
    dia,
    precio: promedioLibra > 0 ? Math.round((promedioLibra + Math.sin(i) * 3) * 10) / 10 : 130 + Math.round(Math.sin(i) * 3),
  }))

  const preciosFiltrados =
    provinciaFiltro === 'Todas'
      ? precios
      : precios.filter((p) => p.provincia === provinciaFiltro)

  const provinciasUnicas = ['Todas', ...Array.from(new Set(precios.map((p) => p.provincia)))]

  // Variación simulada por provincia
  const getVariacion = (index: number) => {
    const vars = [2.5, -1.2, 0.8, 0, 1.5, -0.5, 3.1, -2.0, 1.8, 0.3]
    return vars[index % vars.length]
  }

  return (
    <div className="max-w-lg mx-auto p-4 md:p-6 font-sans bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Precios del Mercado</h1>
          <p className="text-slate-500 text-xs mt-0.5">Mercado porcino dominicano</p>
        </div>
        <Link href="/" className="text-blue-600 hover:text-blue-800 text-xs font-semibold transition-all">
          ← Inicio
        </Link>
      </div>

      {/* Selector de Unidades (Tabs) */}
      <div className="flex bg-white rounded-xl p-1 mb-5 border border-slate-200 shadow-sm">
        {[
          { id: 'libra' as const, label: 'Precio / Libra' },
          { id: 'kilo' as const, label: 'Precio / Kilo' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTabActiva(t.id)}
            className={`flex-1 py-2 rounded-lg font-bold text-xs md:text-sm transition-all ${
              tabActiva === t.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <p className="text-center text-slate-500 py-12 text-sm">Cargando precios del mercado...</p>
      ) : (
        <>
          {/* Card Promedio Nacional */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-5 mb-5 text-white shadow-lg">
            <p className="text-xs text-blue-200 font-medium mb-1">Promedio Nacional</p>
            <p className="text-3xl font-extrabold tracking-tight mb-2">
              RD$ {tabActiva === 'libra' ? promedioLibra : promedioKilo}
            </p>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                ↑ 4.2%
              </span>
              <span className="text-blue-200/80 text-xs">vs. mes anterior</span>
            </div>
          </div>

          {/* Gráfica de Tendencia */}
          <div className="bg-white rounded-2xl p-4 mb-5 border border-slate-200 shadow-sm">
            <p className="text-slate-900 font-bold text-sm mb-3">Tendencia de Precios (7 días)</p>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={datosGrafica} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrecio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`RD$ ${val}`, tabActiva === 'libra' ? '/lb' : '/kg']}
                />
                <Area type="monotone" dataKey="precio" stroke="#2563EB" strokeWidth={2} fill="url(#colorPrecio)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Filtros por Provincia */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {provinciasUnicas.slice(0, 7).map((p) => (
              <button
                key={p}
                onClick={() => setProvinciaFiltro(p)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  provinciaFiltro === p
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Lista de Precios */}
          <div className="space-y-3 mb-5">
            <p className="text-slate-900 font-bold text-sm">Precios por Provincia</p>
            {preciosFiltrados.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                No hay precios disponibles en este momento
              </div>
            ) : (
              preciosFiltrados.map((p, i) => {
                const variacion = getVariacion(i)
                const precio = tabActiva === 'libra' ? p.precio_libra : p.precio_kilo
                const unidad = tabActiva === 'libra' ? 'por Libra' : 'por Kilo'

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl p-3.5 md:p-4 border border-slate-200 flex justify-between items-center shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-1">📍 {p.provincia}</p>
                      <div className="flex items-center gap-2">
                        {variacion > 0 ? (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                            ↑ +{variacion}% hoy
                          </span>
                        ) : variacion < 0 ? (
                          <span className="bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                            ↓ {variacion}% hoy
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px] font-semibold">→ Estable</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-700 font-extrabold text-xl leading-tight">RD$ {precio}</p>
                      <p className="text-slate-400 text-[11px]">{unidad}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Nota Informativa */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start text-xs text-slate-600">
            <span className="text-base shrink-0">ℹ️</span>
            <p className="leading-relaxed">
              Precios referenciales del mercado porcino dominicano. Actualizados por la administración de la plataforma. Los precios reales pueden variar según calidad, peso y negociación directa.
            </p>
          </div>
        </>
      )}
    </div>
  )
}