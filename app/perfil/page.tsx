'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Perfil() {
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [misPublicaciones, setMisPublicaciones] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [eliminandoId, setEliminandoId] = useState<string | null>(null)

  useEffect(() => {
    cargarDatosPerfil()
  }, [])

  const cargarDatosPerfil = async () => {
    setCargando(true)
    const { data: { user: usuarioAuth } } = await supabase.auth.getUser()

    if (!usuarioAuth) {
      window.location.href = '/login'
      return
    }

    setUser(usuarioAuth)

    // Cargar información del perfil
    const { data: perfilData } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', usuarioAuth.id)
      .single()

    setPerfil(perfilData)

    // Cargar publicaciones del usuario
    const { data: pubData } = await supabase
      .from('publicaciones')
      .select('*')
      .eq('usuario_id', usuarioAuth.id)
      .order('created_at', { ascending: false })

    setMisPublicaciones(pubData || [])
    setCargando(false)
  }

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta publicación?')) return

    setEliminandoId(id)
    const { error } = await supabase
      .from('publicaciones')
      .delete()
      .eq('id', id)

    if (!error) {
      setMisPublicaciones(prev => prev.filter(p => p.id !== id))
    } else {
      alert('Error al eliminar la publicación')
    }
    setEliminandoId(null)
  }

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (cargando) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <p style={{ color: '#64748B' }}>Cargando perfil...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', fontFamily: "'Inter', sans-serif", backgroundColor: '#FFFFFF', minHeight: '100vh', boxShadow: '0 0 20px rgba(0,0,0,0.05)', paddingBottom: '80px' }}>

      {/* Encabezado */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', margin: 0 }}>Mi Perfil</h1>
        <button onClick={handleCerrarSesion} style={{ color: '#EF4444', backgroundColor: '#FEE2E2', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>

      <div style={{ padding: '16px 20px' }}>

        {/* Tarjeta de Información de Usuario */}
        <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#0253A3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', flexShrink: 0, overflow: 'hidden' }}>
            {perfil?.foto_perfil ? (
              <img src={perfil.foto_perfil} alt={perfil.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              perfil?.nombre ? perfil.nombre.slice(0, 2).toUpperCase() : '👤'
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {perfil?.nombre || 'Usuario'}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 2px 0' }}>
              📞 {perfil?.telefono || 'Sin teléfono registrado'}
            </p>
            <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              ✉️ {user?.email}
            </p>
          </div>
        </div>

        {/* Encabezado Sección Mis Publicaciones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B', margin: 0 }}>Mis Anuncios ({misPublicaciones.length})</h3>
          <Link href="/publicar" style={{ color: '#0253A3', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
            + Crear Nuevo
          </Link>
        </div>

        {/* Lista de Publicaciones del Usuario */}
        {misPublicaciones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 16px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', color: '#94A3B8' }}>
            <p style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#64748B' }}>Aún no has publicado ningún anuncio.</p>
            <Link href="/publicar" style={{ backgroundColor: '#0253A3', color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', display: 'inline-block' }}>
              Publicar ahora
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {misPublicaciones.map((pub) => {
              const estaActiva = pub.activo
              const estaPendiente = !pub.activo && pub.estado === 'pendiente'

              return (
                <div key={pub.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  
                  {/* Foto Miniatura */}
                  <div style={{ width: '64px', height: '64px', borderRadius: '10px', backgroundColor: '#F1F5F9', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pub.foto_url ? (
                      <img src={pub.foto_url} alt={pub.tipo_animal} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '24px' }}>🐷</span>
                    )}
                  </div>

                  {/* Detalles */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', textTransform: 'capitalize' }}>
                        {pub.tipo_animal}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#0253A3' }}>
                        RD$ {pub.precio ? Number(pub.precio).toLocaleString('es-DO') : '0'}
                      </span>
                    </div>

                    <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 6px 0' }}>
                      📍 {pub.provincia}
                    </p>

                    {/* Badge de Estado */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {estaActiva ? (
                        <span style={{ backgroundColor: '#D1FAE5', color: '#059669', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
                          ✓ Activo
                        </span>
                      ) : estaPendiente ? (
                        <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
                          ⏳ En Revisión
                        </span>
                      ) : (
                        <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
                          ✕ Inactivo
                        </span>
                      )}

                      {/* Botón Eliminar */}
                      <button
                        onClick={() => handleEliminar(pub.id)}
                        disabled={eliminandoId === pub.id}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#EF4444', fontSize: '12px', cursor: 'pointer', padding: '2px 6px', fontWeight: '600' }}>
                        {eliminandoId === pub.id ? '...' : '🗑️ Eliminar'}
                      </button>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}

      </div>

      {/* Barra de Navegación Inferior (Bottom Nav) */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '440px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-around', padding: '8px 0 12px 0', zIndex: 20 }}>
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#64748B', fontSize: '11px', fontWeight: '500' }}>
          <span style={{ fontSize: '18px' }}>🏠</span>
          Inicio
        </Link>
        <Link href="/directorio" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#64748B', fontSize: '11px', fontWeight: '500' }}>
          <span style={{ fontSize: '18px' }}>🏢</span>
          Directorio
        </Link>
        <Link href="/chat" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#64748B', fontSize: '11px', fontWeight: '500' }}>
          <span style={{ fontSize: '18px' }}>💬</span>
          Chat
        </Link>
        <Link href="/perfil" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#0253A3', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>👤</span>
          Perfil
        </Link>
      </div>

    </div>
  )
}