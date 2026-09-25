'use client'

import Link from 'next/link'

interface MetodoApoyo {
  icon: string
  titulo: string
  desc: string
  detalle: string
}

export default function Apoyanos() {
  const numeroWhatsapp = "8091234567" // Cambia por tu número real
  const mensajeWhatsapp = encodeURIComponent("¡Hola! Me gustaría apoyar el proyecto Porcicultores RD.")
  const enlacePaypal = "https://paypal.me/tucuenta" // Cambia por tu enlace real

  const metodos: MetodoApoyo[] = [
    {
      icon: '💬',
      titulo: 'WhatsApp',
      desc: 'Contacto directo',
      detalle: 'Escríbenos para alianzas o soporte',
    },
    {
      icon: '💳',
      titulo: 'PayPal',
      desc: 'Donación rápida y segura',
      detalle: 'Apoya el mantenimiento del servidor',
    },
  ]

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#F4F6F9',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1
            style={{
              color: '#1A3C5E',
              fontSize: '22px',
              fontWeight: '700',
              margin: '0 0 4px 0',
            }}
          >
            Apóyanos 🤝
          </h1>
          <p
            style={{
              color: '#6B7280',
              fontSize: '13px',
              margin: 0,
            }}
          >
            Ayúdanos a mantener viva la comunidad porcina
          </p>
        </div>

        <Link
          href="/"
          style={{
            color: '#2563A8',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          ← Inicio
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {metodos.map((m: MetodoApoyo) => (
          <div
            key={m.titulo}
            style={{
              backgroundColor: 'white',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              border: '1px solid #E5E7EB',
            }}
          >
            <span style={{ fontSize: '28px', flexShrink: 0 }}>{m.icon}</span>
            <div>
              <h3
                style={{
                  color: '#1A3C5E',
                  fontWeight: '700',
                  fontSize: '15px',
                  margin: '0 0 2px 0',
                }}
              >
                {m.titulo}
              </h3>
              <p
                style={{
                  color: '#4B5563',
                  fontSize: '13px',
                  margin: '0 0 2px 0',
                  fontWeight: '600',
                }}
              >
                {m.desc}
              </p>
              <p style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>
                {m.detalle}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <a
          href={`https://wa.me/${numeroWhatsapp}?text=${mensajeWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#25D366',
            color: 'white',
            padding: '14px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '15px',
          }}
        >
          💬 Escribir por WhatsApp
        </a>

        <a
          href={enlacePaypal}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0070BA',
            color: 'white',
            padding: '14px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '15px',
          }}
        >
          💳 Donar con PayPal
        </a>
      </div>
    </div>
  )
}