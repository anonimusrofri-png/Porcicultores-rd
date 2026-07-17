'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Perfil { id: string; nombre: string; foto_perfil?: string }
interface Conversacion { id: string; nombre: string; foto_perfil?: string; ultimoMensaje: string; fecha: string }
interface Mensaje { id: string; de_usuario: string; para_usuario: string; contenido: string; created_at: string }

function ChatContenido() {
  const searchParams = useSearchParams()
  const usuarioParam = searchParams.get('usuario')
  const [usuario, setUsuario] = useState<Perfil | null>(null)
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([])
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Conversacion | null>(null)
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const mensajesRef = useRef<HTMLDivElement>(null)
  const usuarioRef = useRef<Perfil | null>(null)
  const seleccionadoRef = useRef<Conversacion | null>(null)

  useEffect(() => { cargarUsuario() }, [])
  useEffect(() => { usuarioRef.current = usuario }, [usuario])
  useEffect(() => { seleccionadoRef.current = usuarioSeleccionado }, [usuarioSeleccionado])
  useEffect(() => { if (mensajesRef.current) mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight }, [mensajes])

  useEffect(() => {
    if (!usuario) return
    const canal = supabase.channel('chat-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, (payload) => {
        const nuevo = payload.new as Mensaje
        const yo = usuarioRef.current
        const otro = seleccionadoRef.current
        if (yo && otro && ((nuevo.de_usuario === yo.id && nuevo.para_usuario === otro.id) || (nuevo.de_usuario === otro.id && nuevo.para_usuario === yo.id))) {
          setMensajes(prev => [...prev, nuevo])
        }
        if (yo) cargarConversaciones(yo.id)
      }).subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [usuario])

  const cargarUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setCargando(false); return }
    const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', user.id).single()
    setUsuario(perfil)
    await cargarConversaciones(user.id)
    if (usuarioParam) await abrirPorId(usuarioParam)
    setCargando(false)
  }

  const abrirPorId = async (id: string) => {
    const { data } = await supabase.from('perfiles').select('id, nombre, foto_perfil').eq('id', id).single()
    if (data) {
      const conv: Conversacion = { id: data.id, nombre: data.nombre, foto_perfil: data.foto_perfil, ultimoMensaje: '', fecha: '' }
      setUsuarioSeleccionado(conv)
      seleccionadoRef.current = conv
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: msgs } = await supabase.from('mensajes').select('*')
        .or(`and(de_usuario.eq.${user.id},para_usuario.eq.${id}),and(de_usuario.eq.${id},para_usuario.eq.${user.id})`)
        .order('created_at', { ascending: true })
      setMensajes(msgs || [])
    }
  }

  const cargarConversaciones = async (userId: string) => {
    const { data } = await supabase.from('mensajes')
      .select('*, de_usuario:perfiles!mensajes_de_usuario_fkey(id, nombre, foto_perfil), para_usuario:perfiles!mensajes_para_usuario_fkey(id, nombre, foto_perfil)')
      .or(`de_usuario.eq.${userId},para_usuario.eq.${userId}`)
      .order('created_at', { ascending: false })
    if (!data) return
    const vistos = new Set<string>()
    const unicas: Conversacion[] = []
    data.forEach((m: any) => {
      const otro = m.de_usuario.id === userId ? m.para_usuario : m.de_usuario
      if (!vistos.has(otro.id)) {
        vistos.add(otro.id)
        unicas.push({ id: otro.id, nombre: otro.nombre, foto_perfil: otro.foto_perfil, ultimoMensaje: m.contenido, fecha: m.created_at })
      }
    })
    setConversaciones(unicas)
  }

  const abrirConversacion = async (conv: Conversacion) => {
    setUsuarioSeleccionado(conv)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('mensajes').select('*')
      .or(`and(de_usuario.eq.${user.id},para_usuario.eq.${conv.id}),and(de_usuario.eq.${conv.id},para_usuario.eq.${user.id})`)
      .order('created_at', { ascending: true })
    setMensajes(data || [])
  }

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !usuarioSeleccionado) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const contenido = nuevoMensaje.trim()
    setNuevoMensaje('')
    await supabase.from('mensajes').insert({ de_usuario: user.id, para_usuario: usuarioSeleccionado.id, contenido })
  }

  if (!usuario && !cargando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '48px 24px', maxWidth: '420px', textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>\uD83D\uDCAC</div>
        <h2 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Mensajes Privados</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '28px' }}>Debes iniciar sesi\u00f3n para acceder a los mensajes.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/registro" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Crear Cuenta</Link>
          <Link href="/login" style={{ backgroundColor: '#F4F6F9', color: '#1A3C5E', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Iniciar Sesi\u00f3n</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'Inter, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F4F6F9' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A3C5E, #2563A8)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>\uD83D\uDCAC Mensajes Privados</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0 }}>Comunicaci\u00f3n directa y segura</p>
        </div>
        <Link href="/buscar-usuarios" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>
          + Nuevo Chat
        </Link>
      </div>
      <div style={{ backgroundColor: '#FEF3C7', borderBottom: '1px solid #FCD34D', padding: '8px 20px' }}>
        <p style={{ color: '#92400E', fontSize: '12px', margin: 0, textAlign: 'center' }}>\u26A0\uFE0F Porcicultores RD no se hace responsable de estafas. Verifica siempre la identidad antes de realizar pagos.</p>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', overflow: 'hidden' }}>
        <div style={{ borderRight: '1px solid #E5E7EB', backgroundColor: 'white', overflowY: 'auto' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6' }}>
            <p style={{ color: '#111827', fontWeight: '600', fontSize: '14px', margin: 0 }}>Conversaciones</p>
          </div>
          {cargando ? (
            <p style={{ padding: '20px', color: '#9CA3AF', fontSize: '13px', textAlign: 'center' }}>Cargando...</p>
          ) : conversaciones.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>\uD83D\uDCAC</div>
              <p style={{ color: '#9CA3AF', fontSize: '13px', margin: '0 0 12px 0' }}>No tienes conversaciones</p>
              <Link href="/buscar-usuarios" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '12px' }}>Buscar Usuarios</Link>
            </div>
          ) : conversaciones.map((conv) => (
            <div key={conv.id} onClick={() => abrirConversacion(conv)}
              style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #F9FAFB', backgroundColor: usuarioSeleccionado?.id === conv.id ? '#EFF6FF' : 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1A3C5E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px', overflow: 'hidden', flexShrink: 0 }}>
                {conv.foto_perfil ? <img src={conv.foto_perfil} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : conv.nombre?.charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <p style={{ fontWeight: '600', color: usuarioSeleccionado?.id === conv.id ? '#1D4ED8' : '#111827', fontSize: '14px', margin: '0 0 2px 0' }}>{conv.nombre}</p>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.ultimoMensaje}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#F9FAFB' }}>
          {!usuarioSeleccionado ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>\uD83D\uDCAC</div>
              <p style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 8px 0', color: '#6B7280' }}>Selecciona una conversaci\u00f3n</p>
              <p style={{ fontSize: '13px', margin: '0 0 20px 0', textAlign: 'center' }}>O busca un usuario para iniciar un chat</p>
              <Link href="/buscar-usuarios" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>Buscar Usuarios</Link>
            </div>
          ) : (
            <>
              <div style={{ backgroundColor: 'white', padding: '12px 16px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1A3C5E', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700' }}>
                  {usuarioSeleccionado.foto_perfil ? <img src={usuarioSeleccionado.foto_perfil} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : usuarioSeleccionado.nombre?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', color: '#111827', fontSize: '14px', margin: 0 }}>{usuarioSeleccionado.nombre}</p>
                  <p style={{ color: '#10B981', fontSize: '11px', margin: 0, fontWeight: '600' }}>\u25CF En l\u00ednea</p>
                </div>
                <Link href={"/usuario/" + usuarioSeleccionado.id} style={{ color: '#2563A8', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>Ver perfil</Link>
              </div>
              <div ref={mensajesRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mensajes.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF', fontSize: '13px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>\uD83D\uDC4B</div>
                    <p style={{ margin: 0 }}>Inicia la conversaci\u00f3n con {usuarioSeleccionado.nombre}</p>
                  </div>
                )}
                {mensajes.map((m) => (
                  <div key={m.id} style={{ alignSelf: m.de_usuario === usuario?.id ? 'flex-end' : 'flex-start', backgroundColor: m.de_usuario === usuario?.id ? '#1A3C5E' : 'white', color: m.de_usuario === usuario?.id ? 'white' : '#111827', padding: '10px 14px', borderRadius: m.de_usuario === usuario?.id ? '14px 14px 4px 14px' : '14px 14px 14px 4px', maxWidth: '70%', fontSize: '14px', lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    {m.contenido}
                    <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '4px', textAlign: 'right' }}>
                      {new Date(m.created_at).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 16px', backgroundColor: 'white', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input value={nuevoMensaje} onChange={(e) => setNuevoMensaje(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
                  placeholder={"Mensaje a " + usuarioSeleccionado.nombre + "..."}
                  style={{ flex: 1, padding: '11px 16px', borderRadius: '24px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', backgroundColor: '#F9FAFB' }} />
                <button onClick={enviarMensaje} disabled={!nuevoMensaje.trim()}
                  style={{ backgroundColor: nuevoMensaje.trim() ? '#1A3C5E' : '#E5E7EB', color: nuevoMensaje.trim() ? 'white' : '#9CA3AF', border: 'none', padding: '11px 20px', borderRadius: '24px', cursor: nuevoMensaje.trim() ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '14px' }}>
                  Enviar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Chat() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Cargando...</div>}>
      <ChatContenido />
    </Suspense>
  )
}
