'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Contacto() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleEnviar = () => {
    if (!nombre || !email || !mensaje) return
    setEnviado(true)
  }

  if (enviado) return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', border: '1px solid #ddd', borderRadius: '16px', backgroundColor: 'white' }}>
      <h2 style={{ color: '#16a34a', marginBottom: '12px', fontWeight: '800' }}>Mensaje enviado</h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Gracias por contactarnos. Te responderemos pronto.</p>
      <Link href="/" style={{ backgroundColor: '#0a2463', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' }}>Volver al inicio</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '40px', fontFamily: 'sans-serif', border: '1px solid #e2e8f0', borderRadius: '16px', backgroundColor: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800' }}>Contactanos</h1>
        <Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>Volver</Link>
      </div>

      <input type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

      <input type="email" placeholder="Tu correo electronico" value={email} onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

      <textarea placeholder="Tu mensaje..." value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={5}
        style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

      <button onClick={handleEnviar}
        style={{ width: '100%', padding: '14px', backgroundColor: '#0a2463', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>
        Enviar Mensaje
      </button>
    </div>
  )
}