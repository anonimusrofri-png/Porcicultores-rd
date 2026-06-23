'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Chat() {
  const [usuario, setUsuario] = useState<any>(null)
  const [conversaciones, setConversaciones] = useState<any[]>([])
  const [mensajes, setMensajes] = useState<any[]>([])
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null)
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const mensajesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    cargarUsuario()
  }, [])

  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight
    }
  }, [mensajes])

  const cargarUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setCargando(false); return }
    const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', user.id).single()
    setUsuario(perfil)
    cargarConversaciones(user.id)
    setCargando(false)
  }

  const cargarConversaciones = async (userId: string) => {
    const { data } = await supabase
      .from('mensajes')
      .select('*, de_usuario:perfiles!mensajes_de_usuario_fkey(id, nombre), para_usuario:perfiles!mensajes_para_usuario_fkey(id, nombre)')
      .or(`de_usuario.eq.${userId},para_usuario.eq.${userId}`)
      .order('created_at', { ascending: false })
    if (!data) return
    const vistos = new Set()
    const unicas: any[] = []
    data.forEach((m) => {
      const otroId = m.de_usuario.id === userId ? m.para_usuario.id : m.de_usuario.id
      const otroNombre = m.de_usuario.id === userId ? m.para_usuario.nombre : m.de_usuario.nombre
      if (!vistos.has(otroId)) {
        vistos.add(otroId)
        unicas.push({ id: otroId, nombre: otroNombre, ultimoMensaje: m.contenido })
      }
    })
    setConversaciones(unicas)
  }

  const cargarMensajes = async (otroUsuario: any) => {
    setUsuarioSeleccionado(otroUsuario)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('mensajes')
      .select('*')
      .or(`and(de_usuario.eq.${user.id},para_usuario.eq.${otroUsuario.id}),and(de_usuario.eq.${otroUsuario.id},para_usuario.eq.${user.id})`)
      .order('created_at', { ascending: true })
    setMensajes(data || [])
  }

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !usuarioSeleccionado) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('mensajes').insert({
      de_usuario: user.id,
      para_usuario: usuarioSeleccionado.id,
      contenido: nuevoMensaje.trim()
    }).select().single()
    if (data) {
      setMensajes([...mensajes, data])
      setNuevoMensaje('')
      cargarConversaciones(user.id)
    }
  }

  if (!usuario && !cargando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '48px', maxWidth: '480px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Acceso exclusivo para miembros</h2>
        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>Debes iniciar sesion para acceder a los mensajes privados.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/registro" style={{ backgroundColor: '#0a2463', color: 'white', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>Crear Cuenta</Link>
          <Link href="/login" style={{ backgroundColor: '#f0f4f8', color: '#0a2463', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>Iniciar Sesion</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900' }}>Mensajes Privados</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>

      <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fcd34d', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#92400e' }}>
        Porcicultores RD no se hace responsable de estafas o negocios mal realizados. Verifique siempre la identidad del vendedor antes de realizar pagos.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px', height: '520px' }}>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'white' }}>
          <div style={{ backgroundColor: '#0a2463', color: 'white', padding: '14px 16px', fontWeight: '800', fontSize: '15px' }}>Conversaciones</div>
          {conversaciones.length === 0 ? (
            <p style={{ padding: '20px', color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>No tienes conversaciones todavia</p>
          ) : (
            conversaciones.map((conv) => (
              <div key={conv.id} onClick={() => cargarMensajes(conv)}
                style={{ padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', backgroundColor: usuarioSeleccionado?.id === conv.id ? '#e0f2fe' : 'white' }}>
                <div style={{ fontWeight: '700', color: '#0a2463', fontSize: '14px' }}>{conv.nombre}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>{conv.ultimoMensaje}</div>
              </div>
            ))
          )}
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'white' }}>
          {!usuarioSeleccionado ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '15px' }}>
              Selecciona una conversacion
            </div>
          ) : (
            <>
              <div style={{ backgroundColor: '#0a2463', color: 'white', padding: '14px 16px', fontWeight: '800', fontSize: '15px' }}>
                {usuarioSeleccionado.nombre}
              </div>
              <div ref={mensajesRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mensajes.map((m) => (
                  <div key={m.id} style={{ alignSelf: m.de_usuario === usuario?.id ? 'flex-end' : 'flex-start', backgroundColor: m.de_usuario === usuario?.id ? '#0a2463' : '#f0f4f8', color: m.de_usuario === usuario?.id ? 'white' : '#1e293b', padding: '10px 14px', borderRadius: '14px', maxWidth: '70%', fontSize: '14px', lineHeight: 1.5 }}>
                    {m.contenido}
                    <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px', textAlign: 'right' }}>
                      {new Date(m.created_at).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                <input value={nuevoMensaje} onChange={(e) => setNuevoMensaje(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
                  placeholder="Escribe un mensaje..."
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                <button onClick={enviarMensaje}
                  style={{ backgroundColor: '#0a2463', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
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