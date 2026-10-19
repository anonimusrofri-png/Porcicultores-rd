'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans">
      
      {/* Barra de Navegación Superior */}
      <header className="bg-[#0B2545] text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#0B2545] text-xs">
            🐷 RD
          </div>
          <span className="font-extrabold text-lg tracking-wide hidden sm:inline">
            PORCICULTORES RD
          </span>
        </div>

        <nav className="flex items-center gap-6 text-sm font-semibold text-slate-200">
          <Link href="/marketplace" className="hover:text-white transition-colors">
            Marketplace
          </Link>
          <Link href="/directorio" className="hover:text-white transition-colors">
            Directorio
          </Link>
          <Link href="/precios" className="hover:text-white transition-colors">
            Precios
          </Link>
          <Link href="/perfil" className="hover:text-white transition-colors">
            Mi Perfil
          </Link>
          <span className="text-xl">🔔</span>
        </nav>
      </header>

      {/* Hero Header Principal (Banner Azul) */}
      <section className="bg-gradient-to-b from-[#0B2545] to-[#134074] text-white pt-16 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
            Impulsando tu Negocio<br />Porcino Dominicano
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto mb-8 opacity-90 leading-relaxed">
            Conectamos productores, compradores, y servicios para un mercado más justo y transparente en la República Dominicana.
          </p>
          
          {/* Botones de Acción Principales */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/marketplace"
              className="bg-[#C81D25] hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md text-sm"
            >
              Ver Marketplace
            </Link>
            <Link
              href="/precios"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-6 py-3 rounded-xl transition-all text-sm backdrop-blur-sm"
            >
              Consultar Precios por Provincia
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Tarjetas de Accesos Rápidos */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 -mt-12 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta 1: Marketplace */}
          <Link
            href="/marketplace"
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-100 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🐷
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Marketplace Porcino</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Compra y vende cerdos, lechones y reproductores de forma directa.
              </p>
            </div>
          </Link>

          {/* Tarjeta 2: Directorio */}
          <Link
            href="/directorio"
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-100 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🏥
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Directorio de Servicios</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Veterinarios, agroveterinarias y servicios para el fomento del sector.
              </p>
            </div>
          </Link>

          {/* Tarjeta 3: Precios */}
          <Link
            href="/precios"
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-100 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📈
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Precios por Provincia</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Precios de referencia por libra/kilo actualizados por provincia.
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* Sección Novedades y Noticias */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Novedades y Noticias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Nuevo Filtro por Peso Añadido al Marketplace
            </h4>
            <p className="text-xs text-slate-400 mb-3">16 dic 2026</p>
            <p className="text-slate-600 text-xs leading-relaxed">
              Guía de Seguridad: Cómo Evitar Estafas en transacciones comerciales.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Reporte Semanal de Precios
            </h4>
            <p className="text-xs text-slate-400 mb-3">28 nov 2026</p>
            <p className="text-slate-600 text-xs leading-relaxed">
              Consulta las variaciones del mercado porcino en las principales provincias.
            </p>
          </div>

        </div>
      </section>

    </div>
  )
}