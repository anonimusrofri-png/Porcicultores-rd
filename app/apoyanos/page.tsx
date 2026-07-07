'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Apoyanos() {
  const [monto, setMonto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)

  const enviarApoyo = async () => {
    if (!monto) return
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('apoyos').insert({
      usuario_id: user?.id || null,
      monto: parseFloat(monto),
      mensaje
    })
    setEnviado(true)
    setCargando(false)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '24px', fontWeight: '900', margin: 0 }}>Apoya Porcicultores RD</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0a2463, #1565c0)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '8px' }}>Tu apoyo mantiene esta plataforma viva</h2>
        <p style={{ opacity: 0.85, fontSize: '15px', lineHeight: 1.7, margin: 0 }}>Porcicultores RD es una plataforma gratuita para el sector porcino dominicano. Tu contribucion voluntaria nos ayuda a mantener los servidores y seguir mejorando.</p>
      </div>

      <div style={{ backgroundColor: 'white', border: '2px solid #0a2463', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ color: '#0a2463', fontWeight: '800', marginBottom: '20px', fontSize: '18px' }}>Datos para Transferencia Bancaria</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Banco', valor: 'BHD' },
            { label: 'Tipo de Cuenta', valor: 'Cuenta de Ahorro' },
            { label: 'Numero de Cuenta', valor: '40005920019' },
            { label: 'Titular', valor: 'Noelia Frias' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '10px', padding: '14px 18px' }}>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>{item.label}</span>
              <span style={{ color: '#0a2463', fontSize: '15px', fontWeight: '800' }}>{item.valor}</span>
            </div>
          ))}
        </div>
        <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fcd34d', borderRadius: '10px', padding: '14px', marginTop: '16px', fontSize: '13px', color: '#92400e', lineHeight: 1.6 }}>
          Realiza tu transferencia directamente desde tu app bancaria y luego reportala abajo para que quede registrada.
        </div>
      </div>

      {enviado ? (
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐖</div>
          <h3 style={{ color: '#16a34a', fontWeight: '800', marginBottom: '8px' }}>Gracias por tu apoyo</h3>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Tu contribucion ha sido registrada. Porcicultores RD te lo agradece.</p>
          <Link href="/" style={{ display: 'inline-block', backgroundColor: '#0a2463', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700' }}>Volver al Inicio</Link>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ color: '#0a2463', fontWeight: '800', marginBottom: '16px' }}>Reportar mi Transferencia</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>Una vez realizada la transferencia, ingresa el monto aqui para que quede registrado.</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {['200', '500', '1000', '2000', '5000'].map(m => (
              <button key={m} onClick={() => setMonto(m)}
                style={{ backgroundColor: monto === m ? '#0a2463' : '#f0f4f8', color: monto === m ? 'white' : '#0a2463', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                RD$ {m}
              </button>
            ))}
          </div>
          <input type="number" placeholder="O escribe otro monto en RD$" value={monto} onChange={(e) => setMonto(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
          <textarea placeholder="Mensaje opcional..." value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={3}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
          <button onClick={enviarApoyo} disabled={cargando || !monto}
            style={{ width: '100%', padding: '14px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>
            {cargando ? 'Registrando...' : 'Registrar mi Apoyo'}
          </button>
        </div>
      )}
    </div>
  )
}