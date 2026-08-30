'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Chat() {
  const [user, setUser] = useState<any>(null)
  const [conversaciones, setConversaciones] = useState<any[]>([])
  const [chatActivo, setChatActivo] = useState<any>(null)
  const [mensajes, setMensajes] = useState<any[]>([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inicializarChat()
  }, [])

  useEffect(() => {
    if (chatActivo && user) {
      cargarMensajes(chatActivo.id)
      const canal = supabase
        .channel(`chat_${chatActivo.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, (payload) => {
          if (
            (payload.new.emisor_id === user?.id && payload.new.receptor_id === chatActivo.id) ||
            (payload.new.emisor_id === chatActivo.id && payload.new.receptor_id === user?.id)
          ) {
            setMensajes((prev) => [...prev, payload.new])
          }
        })
        .subscribe()

      return () => {
        supabase.removeChannel(canal)
      }
    }
  }, [chatActivo, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const inicializarChat = async () => {
    setCargando(true)
    const { data: { user: usuarioAuth } } = await supabase.auth.getUser()
    if (!usuarioAuth) {
      window.location.href = '/login'
      return
    }
    setUser(usuarioAuth)

    // Obtener todas las conversaciones
    const { data: msgs } = await supabase
      .from('mensajes')
      .select('*, emisor:perfiles!emisor_id(id, nombre, foto_perfil), receptor:perfiles!receptor_id(id, nombre, foto_perfil)')
      .or(`emisor_id.eq.${usuarioAuth.id},receptor_id.eq.${usuarioAuth.id}`)
      .order('created_at', { ascending: false })

    const contactosMap = new Map()
    msgs?.forEach((m: any) => {
      const otro = m.emisor_id === usuarioAuth.id ? m.receptor : m.emisor
      if (otro && !contactosMap.has(otro.id)) {
        contactosMap.set(otro.id, {
          ...otro,
          ultimoMensaje: m.contenido,
          fecha: m.created_at,
        })
      }
    })

    const listaContactos = Array.from(contactosMap.values())
    setConversaciones(listaContactos)
    setCargando(false)
  }

  const cargarMensajes = async (contactoId: string) => {
    if (!user) return
    const { data } = await supabase
      .from('mensajes')
      .select('*')
      .or(`and(emisor_id.eq.${user.id},receptor_id.eq.${contactoId}),and(emisor_id.eq.${contactoId},receptor_id.eq.${user.id})`)
      .order('created_at', { ascending: true })

    setMensajes(data || [])
  }

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoMensaje.trim() || !chatActivo || enviando || !user) return

    setEnviando(true)
    const texto = nuevoMensaje
    setNuevoMensaje('')

    const { error } = await supabase.from('mensajes').insert({
      emisor_id: user.id,
      receptor_id: chatActivo.id,
      contenido: texto,
    })

    if (error) {
      alert('Error al enviar el mensaje')
    } else {
      setMensajes((prev) => [
        ...prev,
        { id: Date.now(), emisor_id: user.id, receptor_id: chatActivo.id, contenido: texto, created_at: new Date().toISOString() },
      ])
    }
    setEnviando(false)
  }

  if (cargando) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <p style={{ color: '#64748B' }}>Cargando conversaciones...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', fontFamily: "'Inter', sans-serif", backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>

      {/* Encabezado Principal */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {chatActivo && (
            <button onClick={() => setChatActivo(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#0253A3', padding: 0 }}>
              ←
            </button>
          )}
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', margin: 0 }}>
            {chatActivo ? chatActivo.nombre : 'Mensajes Privados'}
          </h1>
        </div>
        <Link href="/perfil" style={{ color: '#0253A3', textDecoration: 'none', fontSize: '13px', fontWeight: '600', backgroundColor: '#EFF6FF', padding: '6px 12px', borderRadius: '20px' }}>
          Perfil
        </Link>
      </div>

      {/* Lista de Conversaciones */}
      {!chatActivo ? (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversaciones.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>💬</div>
              <p style={{ fontSize: '14px', margin: 0 }}>No tienes conversaciones activas.</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>Contacta a un vendedor desde las publicaciones.</p>
            </div>
          ) : (
            conversaciones.map((conv) => (
              <div key={conv.id} onClick={() => setChatActivo(conv)}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0253A3', fontWeight: '700', fontSize: '18px', overflow: 'hidden', flexShrink: 0 }}>
                  {conv.foto_perfil ? <img src={conv.foto_perfil} alt={conv.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : conv.nombre?.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1E293B', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.nombre}</h3>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(conv.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.ultimoMensaje}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Ventana de Conversación Activa */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)' }}>
          {/* Área de Mensajes */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mensajes.map((m) => {
              const esMio = m.emisor_id === user?.id
              return (
                <div key={m.id} style={{ display: 'flex', justifyContent: esMio ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '75%',
                    padding: '10px 14px',
                    borderRadius: esMio ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    backgroundColor: esMio ? '#0253A3' : '#FFFFFF',
                    color: esMio ? '#FFFFFF' : '#1E293B',
                    boxShadow: esMio ? '0 2px 6px rgba(2, 83, 163, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
                    border: esMio ? 'none' : '1px solid #E2E8F0',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    <p style={{ margin: 0 }}>{m.contenido}</p>
                    <span style={{ display: 'block', fontSize: '10px', marginTop: '4px', textAlign: 'right', color: esMio ? 'rgba(255,255,255,0.7)' : '#94A3B8' }}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario / Input de Envío */}
          <form onSubmit={enviarMensaje} style={{ padding: '12px 16px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: '#1E293B' }}
            />
            <button
              type="submit"
              disabled={enviando || !nuevoMensaje.trim()}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: nuevoMensaje.trim() ? '#0253A3' : '#E2E8F0',
                color: 'white',
                border: 'none',
                cursor: nuevoMensaje.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'background-color 0.2s'
              }}>
              ➔
            </button>
          </form>
        </div>
      )}
    </div>
  )
}