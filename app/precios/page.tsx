'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Precios() {
  const [precios, setPrecios] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
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

  if (!usuario && !cargando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '48px', maxWidth: '480px', textAlign: 'center' }}>
        <h2 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Acceso exclusivo para miembros</h2>
        <p style={{ color: '#64748b', marginBottom: '28px' }}>Debes crear una cuenta para ver los precios del mercado.</p>
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
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900', margin: 0 }}>Precios del Mercado</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>

      <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fcd34d', borderRadius: '12px', padding: '14px 16px', marginBottom: '24px', fontSize: '13px', color: '#92400e' }}>
        Precios referenciales del mercado porcino dominicano. Actualizados por el administrador de la plataforma.
      </div>

      {cargando ? (
        <p style={{ color: '#64748b' }}>Cargando precios...</p>
      ) : precios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#94a3b8' }}>No hay precios disponibles todavia</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0a2463', color: 'white' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px' }}>Provincia</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px' }}>Precio/Libra</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px' }}>Precio/Kilo</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px' }}>Actualizado</th>
              </tr>
            </thead>
            <tbody>
              {precios.map((p, i) => (
                <tr key={p.id} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#0a2463' }}>{p.provincia}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#16a34a', fontWeight: '800', fontSize: '15px' }}>RD$ {p.precio_libra}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#16a34a', fontWeight: '700' }}>RD$ {p.precio_kilo}</td>
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