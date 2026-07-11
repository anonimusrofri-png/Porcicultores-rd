'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PerfilPublico() {
  const { id } = useParams()
  const [perfil, setPerfil] = useState<any>(null)
  const [publicaciones, setPublicaciones] = useState<any[]>([])
  const [resenas, setResenas] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [usuarioActual, setUsuarioActual] = useState<any>(null)

  useEffect(() => { cargarDatos() }, [id])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUsuarioActual(user)
    const { data: p } = await supabase.from('perfiles').select('*').eq('id', id).single()
    const { data: pubs } = await supabase.from('publicaciones').select('*').eq('usuario_id', id).eq('estado', 'aprobada').eq('activo', true).order('created_at', { ascending: false })
    const { data: revs } = await supabase.from('resenas').select('*, perfiles(nombre, foto_perfil)').eq('para_usuario', id).order('created_at', { ascending: false })
    setPerfil(p)
    setPublicaciones(pubs || [])
    setResenas(revs || [])
    setCargando(false)
  }

  if (cargando) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F9', fontFamily: "'Inter', sans-serif" }}>
      <p style={{ color: '#6B7280' }}>Cargando perfil...</p>
    </div>
  )

  if (!perfil) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F9', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '16px' }}>Usuario no encontrado</p>
        <Link href="/" style={{ color: '#2563A8', fontWeight: '600' }}>← Volver al inicio</Link>
      </div>
    </div>
  )

  const reputacion = resenas.length > 0 ? Math.round((resenas.reduce((s, r) => s + r.estrellas, 0) / resenas.length) * 10) / 10 : 0

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: "'Inter', sans-serif", backgroundColor: '#F4F6F9', minHeight: '100vh' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href="/buscar-usuarios" style={{ color: '#2563A8', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>← Volver</Link>
        <Link href="/" style={{ color: '#6B7280', fontSize: '13px', textDecoration: 'none' }}>Inicio</Link>
      </div>

      {/* Hero card */}
      <div style={{ background: 'linear-gradient(180deg, #1A3C5E 0%, #2563A8 50%, #1B5E20 100%)', borderRadius: '20px', padding: '32px 24px', marginBottom: '16px', color: 'white', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#1A3C5E', margin: '0 auto 16px', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.5)' }}>
          {perfil.foto_perfil ? <img src={perfil.foto_perfil} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : perfil.nombre?.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 6px 0' }}>{perfil.nombre}</h1>
        <p style={{ opacity: 0.8, fontSize: '14px', margin: '0 0 8px 0' }}>📍 {perfil.provincia}, RD</p>
        {perfil.verificado && <span style={{ backgroundColor: '#10B981', color: 'white', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>✅ Verificado</span>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '10px', alignItems: 'center' }}>
          {[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= Math.round(reputacion) ? '#F59E0B' : 'rgba(255,255,255,0.3)', fontSize: '20px' }}>★</span>)}
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginLeft: '6px' }}>({reputacion})</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'Publicaciones', valor: publicaciones.length, icon: '📋' },
          { label: 'Reseñas', valor: resenas.length, icon: '⭐' },
          { label: 'Reputación', valor: reputacion > 0 ? `${reputacion}/5` : 'Nueva', icon: '🏆' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{s.valor}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Info del usuario */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
        <h3 style={{ color: '#1A3C5E', fontWeight: '700', margin: '0 0 14px 0', fontSize: '15px' }}>Información</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ color: '#6B7280', fontSize: '13px' }}>Tipo de usuario</span>
            <span style={{ color: '#111827', fontSize: '13px', fontWeight: '600', textTransform: 'capitalize' }}>{perfil.tipo}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ color: '#6B7280', fontSize: '13px' }}>Provincia</span>
            <span style={{ color: '#111827', fontSize: '13px', fontWeight: '600' }}>{perfil.provincia}</span>
          </div>
          {perfil.descripcion && (
            <div>
              <span style={{ color: '#6B7280', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Descripción</span>
              <span style={{ color: '#374151', fontSize: '13px', lineHeight: 1.6 }}>{perfil.descripcion}</span>
            </div>
          )}
        </div>
      </div>

      {/* Botones de contacto */}
      {usuarioActual && usuarioActual.id !== id && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {perfil.whatsapp && (
            <a href={`https://wa.me/1${perfil.whatsapp.replace(/\D/g,'')}`} target="_blank"
              style={{ backgroundColor: '#25D366', color: 'white', padding: '14px', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
              💬 WhatsApp
            </a>
          )}
          <Link href={`/chat?usuario=${id}`}
            style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '14px', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
            ✉️ Mensaje
          </Link>
          <Link href={`/resena?para=${id}`}
            style={{ backgroundColor: 'white', color: '#1A3C5E', padding: '14px', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '600', fontSize: '14px', border: '1px solid #E5E7EB' }}>
            ⭐ Dejar Reseña
          </Link>
          <Link href={`/reportar?usuario=${id}`}
            style={{ backgroundColor: 'white', color: '#EF4444', padding: '14px', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '600', fontSize: '14px', border: '1px solid #FECACA' }}>
            ⚠️ Reportar
          </Link>
        </div>
      )}

      {/* Publicaciones activas */}
      {publicaciones.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ color: '#1A3C5E', fontWeight: '700', margin: '0 0 12px 0', fontSize: '15px' }}>Publicaciones activas ({publicaciones.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {publicaciones.map(pub => (
              <div key={pub.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                {pub.foto_url
                  ? <img src={pub.foto_url} alt="animal" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '140px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>🐷</div>
                }
                <div style={{ padding: '12px' }}>
                  <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>{pub.tipo_animal}</span>
                  <p style={{ color: '#1D4ED8', fontWeight: '700', fontSize: '16px', margin: '6px 0 2px 0' }}>RD$ {pub.precio?.toLocaleString()}</p>
                  <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>📍 {pub.provincia}</p>
                  {pub.whatsapp && (
                    <a href={`https://wa.me/1${perfil.whatsapp?.replace(/\D/g,'')}`} target="_blank"
                      style={{ display: 'block', marginTop: '10px', backgroundColor: '#1A3C5E', color: 'white', padding: '8px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                      Contactar
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reseñas */}
      <div>
        <h3 style={{ color: '#1A3C5E', fontWeight: '700', margin: '0 0 12px 0', fontSize: '15px' }}>Reseñas ({resenas.length})</h3>
        {resenas.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
            <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>Este usuario aún no tiene reseñas</p>
          </div>
        ) : resenas.map(r => (
          <div key={r.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '10px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1A3C5E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: '700', overflow: 'hidden' }}>
                  {r.perfiles?.foto_perfil ? <img src={r.perfiles.foto_perfil} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : r.perfiles?.nombre?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>{r.perfiles?.nombre}</span>
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= r.estrellas ? '#F59E0B' : '#E5E7EB', fontSize: '14px' }}>★</span>)}
              </div>
            </div>
            {r.comentario && <p style={{ color: '#374151', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>{r.comentario}</p>}
          </div>
        ))}
      </div>

      {/* Aviso */}
      <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '14px', marginTop: '20px' }}>
        <p style={{ color: '#374151', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
          ℹ️ Porcicultores RD no se hace responsable de tratos realizados fuera de la plataforma. Verifica siempre la identidad antes de hacer una transacción.
        </p>
      </div>
    </div>
  )
}