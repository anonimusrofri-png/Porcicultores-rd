'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Contacto() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)

  const enviar = () => {
    if (!nombre || !email || !mensaje) return
    setEnviado(true)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900', margin: 0 }}>Contactanos</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>
      {enviado ? (
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <h2 style={{ color: '#16a34a', marginBottom: '12px' }}>Mensaje enviado</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>El administrador recibira tu mensaje y te respondera pronto.</p>
          <Link href="/" style={{ backgroundColor: '#0a2463', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700' }}>Volver al Inicio</Link>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px' }}>
          <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>Tienes alguna pregunta, sugerencia o problema? Escribenos y te responderemos lo antes posible.</p>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu correo electronico" style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
          <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Tu mensaje..." rows={5} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
          <button onClick={enviar} disabled={!nombre || !email || !mensaje} style={{ width: '100%', padding: '14px', backgroundColor: '#0a2463', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>Enviar Mensaje</button>
        </div>
      )}
    </div>
  )
}