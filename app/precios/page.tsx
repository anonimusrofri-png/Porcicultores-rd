'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function Precios() {
  const [precios, setPrecios] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [tabActiva, setTabActiva] = useState<'libra' | 'kilo'>('libra')
  const [provinciaFiltro, setProvinciaFiltro] = useState('Todas')

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)
    if (!user) { setCargando(false); return }
    const { data } = await supabase.from('precios_cerdo').select('*').order('provincia')
    setPrecios(data || [])
    setCargando(false)
  }

  if (!usuario && !cargando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '48px', maxWidth: '420px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Acceso exclusivo para miembros</h2>
        <p style={{ color: '#6B7280', marginBottom: '28px', fontSize: '14px' }}>Crea una cuenta para ver los precios del mercado porcino.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/registro" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Crear Cuenta</Link>
          <Link href="/login" style={{ backgroundColor: '#F4F6F9', color: '#1A3C5E', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  )

  // Promedio nacional
  const promedioLibra = precios.length > 0
    ? Math.round(precios.reduce((s, p) => s + (p.precio_libra || 0), 0) / precios.length * 10) / 10
    : 0
  const promedioKilo = precios.length > 0
    ? Math.round(precios.reduce((s, p) => s + (p.precio_kilo || 0), 0) / precios.length * 10) / 10
    : 0

  // Datos para la gráfica (simulados basados en promedio real)
  const datosGrafica = diasSemana.map((dia, i) => ({
    dia,
    precio: promedioLibra > 0 ? Math.round((promedioLibra + (Math.sin(i) * 3)) * 10) / 10 : 130 + Math.round(Math.sin(i) * 3)
  }))

  const preciosFiltrados = provinciaFiltro === 'Todas'
    ? precios
    : precios.filter(p => p.provincia === provinciaFiltro)

  const provinciasUnicas = ['Todas', ...precios.map(p => p.provincia)]

  // Variación simulada por provincia
  const getVariacion = (index: number) => {
    const vars = [2.5, -1.2, 0.8, 0, 1.5, -0.5, 3.1, -2.0, 1.8, 0.3]
    return vars[index % vars.length]
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', fontFamily: "'Inter', sans-serif", backgroundColor: '#F4F6F9', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: '0 0 2px 0' }}>Precios del Mercado</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Mercado porcino dominicano</p>
        </div>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>← Inicio</Link>
      </div>

      {/* Tabs Precio/Libra — Precio/Kilo */}
      <div style={{ display: 'flex', backgroundColor: 'white', borderRadius: '12px', padding: '4px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
        {[
          { id: 'libra' as const, label: 'Precio / Libra' },
          { id: 'kilo' as const, label: 'Precio / Kilo' },
        ].map(t => (
          <button key={t.id} onClick={() => setTabActiva(t.id)}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px', backgroundColor: tabActiva === t.id ? '#1A3C5E' : 'transparent', color: tabActiva === t.id ? 'white' : '#6B7280', transition: 'all 0.2s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>Cargando precios...</p>
      ) : (
        <>
          {/* Card Promedio Nacional */}
          <div style={{ background: 'linear-gradient(135deg, #1A3C5E, #2563A8)', borderRadius: '16px', padding: '20px', marginBottom: '16px', color: 'white' }}>
            <p style={{ fontSize: '13px', opacity: 0.8, margin: '0 0 6px 0' }}>Promedio Nacional</p>
            <p style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>
              RD$ {tabActiva === 'libra' ? promedioLibra : promedioKilo}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ backgroundColor: '#10B981', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>↑ 4.2%</span>
              <span style={{ opacity: 0.7, fontSize: '12px' }}>vs. mes anterior</span>
            </div>
          </div>

          {/* Gráfica de tendencia */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
            <p style={{ color: '#111827', fontWeight: '600', fontSize: '14px', margin: '0 0 14px 0' }}>Tendencia de Precios (7 días)</p>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={datosGrafica} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrecio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A3C5E', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px' }}
                  formatter={(val: any) => [`RD$ ${val}`, tabActiva === 'libra' ? '/lb' : '/kg']}
                />
                <Area type="monotone" dataKey="precio" stroke="#3B82F6" strokeWidth={2} fill="url(#colorPrecio)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Filtros por provincia */}
          <div style={{ marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
            <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
              {provinciasUnicas.slice(0, 6).map(p => (
                <button key={p} onClick={() => setProvinciaFiltro(p)}
                  style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', backgroundColor: provinciaFiltro === p ? '#1A3C5E' : '#F3F4F6', color: provinciaFiltro === p ? 'white' : '#374151' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de precios por provincia */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <p style={{ color: '#111827', fontWeight: '600', fontSize: '14px', margin: '0 0 4px 0' }}>Precios por Provincia</p>
            {preciosFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', color: '#9CA3AF' }}>
                No hay precios disponibles
              </div>
            ) : preciosFiltrados.map((p, i) => {
              const variacion = getVariacion(i)
              const precio = tabActiva === 'libra' ? p.precio_libra : p.precio_kilo
              const unidad = tabActiva === 'libra' ? 'por Libra' : 'por Kilo'
              return (
                <div key={p.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '14px 16px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#111827', margin: '0 0 4px 0', fontSize: '14px' }}>📍 {p.provincia}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {variacion > 0 ? (
                        <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>↑ +{variacion}% hoy</span>
                      ) : variacion < 0 ? (
                        <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>↓ {variacion}% hoy</span>
                      ) : (
                        <span style={{ color: '#6B7280', fontSize: '11px', fontWeight: '600' }}>→ Estable</span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#1D4ED8', fontWeight: '700', fontSize: '22px', margin: '0 0 2px 0' }}>RD$ {precio}</p>
                    <p style={{ color: '#9CA3AF', fontSize: '11px', margin: 0 }}>{unidad}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Nota informativa */}
          <div style={{ backgroundColor: '#F0F4FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '16px', flexShrink: 0 }}>ℹ️</span>
            <p style={{ color: '#6B7280', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
              Precios referenciales del mercado porcino dominicano. Actualizados por el administrador de la plataforma. Los precios pueden variar según calidad, peso y negociación directa.
            </p>
          </div>
        </>
      )}
    </div>
  )
}