'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Precios() {
  const [precios, setPrecios] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [tab, setTab] = useState('libra')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)
    if (!user) { setCargando(false); return }
    const { data } = await supabase.from('precios_cerdo').select('*').order('provincia')
    setPrecios(data || [])
    setCargando(false)
  }

  const promedio = precios.length > 0
    ? (precios.reduce((sum, p) => sum + (tab === 'libra' ? p.precio_libra : p.precio_kilo), 0) / precios.length).toFixed(2)
    : 0

  if (!usuario && !cargando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '48px', maxWidth: '480px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Acceso exclusivo para miembros</h2>
        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>Debes crear una cuenta gratuita para consultar los precios del mercado.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/registro" style={{ backgroundColor: '#0a2463', color: 'white', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>Crear Cuenta</Link>
          <Link href="/login" style={{ backgroundColor: '#f0f4f8', color: '#0a2463', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>Iniciar Sesion</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900' }}>Precios del Mercado</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Precios de referencia por provincia</p>
        </div>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>

      {precios.length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #0a2463, #1565c0)', borderRadius: '16px', padding: '24px', marginBottom: '24px', color: 'white', textAlign: 'center' }}>
          <p style={{ opacity: 0.8, fontSize: '14px', marginBottom: '8px' }}>Promedio Nacional</p>
          <p style={{ fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>RD$ {promedio}</p>
          <p style={{ opacity: 0.8, fontSize: '13px' }}>por {tab === 'libra' ? 'libra' : 'kilo'}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: '#f0f4f8', borderRadius: '12px', padding: '4px' }}>
        {[{ id: 'libra', label: 'Precio por Libra' }, { id: 'kilo', label: 'Precio por Kilo' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px', backgroundColor: tab === t.id ? 'white' : 'transparent', color: tab === t.id ? '#0a2463' : '#64748b', boxShadow: tab === t.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}>
            {t.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando precios...</p>
      ) : precios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#94a3b8' }}>No hay precios disponibles todavia</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0a2463', color: 'white' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700' }}>Provincia</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '700' }}>Precio / {tab === 'libra' ? 'Libra' : 'Kilo'}</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '700' }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {precios.map((p, i) => (
                <tr key={p.id} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#0a2463', fontSize: '14px' }}>{p.provincia}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#16a34a', fontWeight: '900', fontSize: '16px' }}>
                    RD$ {tab === 'libra' ? p.precio_libra : p.precio_kilo}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#94a3b8', fontSize: '12px' }}>{p.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}