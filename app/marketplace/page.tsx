'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = ['Todas','Azua','Bahoruco','Barahona','Dajab\u00f3n','Distrito Nacional','Duarte','El\u00edas Pi\u00f1a','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal','Independencia','La Altagracia','La Romana','La Vega','Mar\u00eda Trinidad S\u00e1nchez','Monse\u00f1or Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata','Saman\u00e1','San Crist\u00f3bal','San Jos\u00e9 de Ocoa','San Juan','San Pedro de Macor\u00eds','S\u00e1nchez Ram\u00edrez','Santiago','Santiago Rodr\u00edguez','Santo Domingo','Valverde']
const tiposAnimales = ['Todos','cerdo','lechon','cerda','verraco','reproductor','engorde']

export default function Marketplace() {
  const [publicaciones, setPublicaciones] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [provincia, setProvincia] = useState('Todas')
  const [tipo, setTipo] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => { cargarDatos() }, [provincia, tipo])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUsuario(user)
    if (!user) { setCargando(false); return }
    let query = supabase.from('publicaciones').select('*, perfiles(id, nombre, provincia, whatsapp, telefono, foto_perfil)').eq('activo', true).eq('estado', 'aprobada')
    if (provincia !== 'Todas') query = query.eq('provincia', provincia)
    if (tipo !== 'Todos') query = query.eq('tipo_animal', tipo)
    const { data } = await query.order('created_at', { ascending: false })
    setPublicaciones(data || [])
    setCargando(false)
  }

  const filtradas = publicaciones.filter(p =>
    busqueda === '' || p.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) || p.tipo_animal?.toLowerCase().includes(busqueda.toLowerCase()) || p.perfiles?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const badgeColor = (tipo: string) => {
    const colores: any = { cerdo: '#DBEAFE', lechon: '#D1FAE5', cerda: '#FEF3C7', verraco: '#EDE9FE', reproductor: '#FCE7F3', engorde: '#FEE2E2' }
    return colores[tipo] || '#F3F4F6'
  }
  const badgeText = (tipo: string) => {
    const textos: any = { cerdo: '#1D4ED8', lechon: '#065F46', cerda: '#D97706', verraco: '#6D28D9', reproductor: '#9D174D', engorde: '#DC2626' }
    return textos[tipo] || '#374151'
  }

  if (!usuario && !cargando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '48px 24px', maxWidth: '420px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', width: '100%' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>\uD83D\uDD12</div>
        <h2 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Acceso exclusivo para miembros</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>Crea una cuenta gratuita para ver las publicaciones y contactar vendedores.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/registro" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Crear Cuenta</Link>
          <Link href="/login" style={{ backgroundColor: '#F4F6F9', color: '#1A3C5E', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Iniciar Sesi\u00f3n</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F6F9', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #1A3C5E, #2563A8)', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0' }}>Marketplace Porcino</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', margin: 0 }}>Rep\u00fablica Dominicana \u2022 {filtradas.length} publicaciones</p>
        </div>
        <Link href="/publicar" style={{ backgroundColor: 'white', color: '#1A3C5E', padding: '10px 20px', borderRadius: '20px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
          + Publicar
        </Link>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
        <input placeholder="\uD83D\uDD0D Buscar cerdos, lechones, vendedores..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#F9FAFB', outline: 'none', marginBottom: '12px' }} />

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '12px' }}>
          {tiposAnimales.map(t => (
            <button key={t} onClick={() => setTipo(t)}
              style={{ padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: '600', backgroundColor: tipo === t ? '#1A3C5E' : '#F3F4F6', color: tipo === t ? 'white' : '#374151', fontSize: '13px', flexShrink: 0 }}>
              {t === 'Todos' ? 'Todos' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB' }}>
          {provincias.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>\uD83D\uDC37</div>
          <p>Cargando publicaciones...</p>
        </div>
      ) : filtradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>\uD83D\uDC37</div>
          <p style={{ color: '#9CA3AF', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No hay publicaciones disponibles</p>
          <Link href="/publicar" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '10px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>S\u00e9 el primero en publicar</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtradas.map((pub) => (
            <div key={pub.id} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ position: 'relative' }}>
                {pub.foto_url
                  ? <img src={pub.foto_url} alt="animal" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '180px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>\uD83D\uDC37</div>
                }
                <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: badgeColor(pub.tipo_animal), color: badgeText(pub.tipo_animal), padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                  {pub.tipo_animal}
                </span>
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <p style={{ color: '#1D4ED8', fontWeight: '700', fontSize: '20px', margin: 0 }}>RD$ {pub.precio?.toLocaleString()}</p>
                  {pub.peso && <span style={{ backgroundColor: '#F3F4F6', color: '#6B7280', padding: '3px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>{pub.peso} lbs</span>}
                </div>
                <p style={{ color: '#374151', fontSize: '13px', marginBottom: '6px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{pub.descripcion}</p>
                <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '10px' }}>\uD83D\uDCCD {pub.provincia}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingTop: '10px', borderTop: '1px solid #F3F4F6' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#1A3C5E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '700', overflow: 'hidden', flexShrink: 0 }}>
                    {pub.perfiles?.foto_perfil ? <img src={pub.perfiles.foto_perfil} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : pub.perfiles?.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <Link href={"/usuario/" + pub.perfiles?.id} style={{ color: '#1A3C5E', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>{pub.perfiles?.nombre}</Link>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {pub.perfiles?.whatsapp && (
                    <a href={"https://wa.me/1" + pub.perfiles.whatsapp.replace(/\D/g,'')} target="_blank"
                      style={{ flex: 1, backgroundColor: '#25D366', color: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                      WhatsApp
                    </a>
                  )}
                  <Link href={"/chat?usuario=" + pub.perfiles?.id}
                    style={{ flex: 1, backgroundColor: '#1A3C5E', color: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                    Mensaje
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
