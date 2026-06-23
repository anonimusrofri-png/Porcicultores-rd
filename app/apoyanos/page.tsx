'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Apoyanos() {
  const [monto, setMonto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const montosSugeridos = [100, 250, 500, 1000, 2500, 5000]

  const handleEnviar = async () => {
    if (!monto || parseFloat(monto) <= 0) {
      setError('Por favor ingresa un monto valido')
      return
    }
    setCargando(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('apoyos').insert({
      usuario_id: user?.id || null,
      monto: parseFloat(monto),
      mensaje,
    })
    if (error) {
      setError('Error al enviar. Intenta de nuevo.')
    } else {
      setEnviado(true)
    }
    setCargando(false)
  }

  if (enviado) return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', border: '1px solid #ddd', borderRadius: '16px', backgroundColor: 'white' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>❤️</div>
      <h2 style={{ color: '#0a2463', marginBottom: '12px', fontWeight: '800' }}>Gracias por tu apoyo</h2>
      <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>Tu contribucion ayuda a mantener y mejorar Porcicultores RD. Gracias por ser parte de esta comunidad.</p>
      <Link href="/" style={{ backgroundColor: '#0a2463', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' }}>Volver al inicio</Link>
    </div>
  )

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #0a2463 0%, #1565c0 100%)', padding: '60px 32px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '12px' }}>Apoya Porcicultores RD</h1>
        <p style={{ fontSize: '16px', opacity: 0.85, maxWidth: '500px', margin: '0 auto' }}>Porcicultores RD es una plataforma creada para ayudar al sector porcino dominicano. Tu apoyo nos ayuda a seguir creciendo.</p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Beneficios */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ color: '#0a2463', fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>Tu apoyo nos ayuda a:</h2>
          {[
            'Mejorar la plataforma constantemente',
            'Agregar nuevas funciones para el sector',
            'Mantener el servicio activo y gratuito',
            'Fortalecer la seguridad y la moderacion',
            'Expandir el directorio agropecuario',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '24px', height: '24px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>✓</div>
              <span style={{ color: '#475569', fontSize: '15px' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Formulario */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ color: '#0a2463', fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>Realizar Contribucion Voluntaria</h2>

          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '14px' }}>Montos sugeridos (RD$)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
            {montosSugeridos.map((m) => (
              <button key={m} onClick={() => setMonto(m.toString())}
                style={{ padding: '10px', borderRadius: '10px', border: '2px solid', borderColor: monto === m.toString() ? '#0a2463' : '#e2e8f0', backgroundColor: monto === m.toString() ? '#0a2463' : 'white', color: monto === m.toString() ? 'white' : '#1e293b', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                RD$ {m.toLocaleString()}
              </button>
            ))}
          </div>

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Otro monto (RD$)</label>
          <input type="number" placeholder="Ingresa el monto que deseas aportar" value={monto} onChange={(e) => setMonto(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Mensaje o sugerencia (opcional)</label>
          <textarea placeholder="Dejanos tu mensaje o sugerencia de mejora..." value={mensaje} onChange={(e) => setMensaje(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

          {error && <p style={{ color: '#dc2626', marginBottom: '12px', fontSize: '14px' }}>{error}</p>}

          <button onClick={handleEnviar} disabled={cargando}
            style={{ width: '100%', padding: '14px', backgroundColor: '#c1121f', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>
            {cargando ? 'Enviando...' : 'Enviar Apoyo'}
          </button>

          <p style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>Las contribuciones son completamente voluntarias. Cualquier monto es bienvenido.</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}