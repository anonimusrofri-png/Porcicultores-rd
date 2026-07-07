'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = ['Todas','Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional','Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal','Independencia','La Altagracia','La Romana','La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná','San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís','Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde']

export default function Transportistas() {
  const [transportistas, setTransportistas] = useState<any[]>([])
  const [provincia, setProvincia] = useState('Todas')
  const [cargando, setCargando] = useState(true)

  useEffect(() => { cargarDatos() }, [provincia])

  const cargarDatos = async () => {
    setCargando(true)
    let query = supabase.from('perfiles').select('*').eq('tipo', 'transportista')
    if (provincia !== 'Todas') query = query.eq('provincia', provincia)
    const { data } = await query.order('nombre')
    setTransportistas(data || [])
    setCargando(false)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900', margin: 0 }}>Transportistas</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>
      <select value={provincia} onChange={(e) => setProvincia(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white' }}>
        {provincias.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      {cargando ? <p style={{ color: '#64748b' }}>Cargando...</p> : transportistas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#94a3b8' }}>No hay transportistas registrados en esta provincia</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {transportistas.map((t) => (
            <div key={t.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0a2463', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', overflow: 'hidden', flexShrink: 0 }}>
                  {t.foto_perfil ? <img src={t.foto_perfil} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : t.nombre?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: '800', color: '#0a2463', margin: 0 }}>{t.nombre}</p>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>📍 {t.provincia}</p>
                </div>
              </div>
              {t.descripcion && <p style={{ color: '#475569', fontSize: '13px', marginBottom: '12px', lineHeight: 1.5 }}>{t.descripcion}</p>}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                {[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= Math.round(t.estrellas || 0) ? '#fbbf24' : '#e2e8f0', fontSize: '14px' }}>★</span>)}
              </div>
              {t.whatsapp && <a href={`https://wa.me/1${t.whatsapp.replace(/\D/g,'')}`} target="_blank" style={{ display: 'block', backgroundColor: '#25d366', color: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>Contactar por WhatsApp</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}