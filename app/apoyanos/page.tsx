'use client'

import Link from 'next/link'

interface MetodoApoyo {
  icon: string
  titulo: string
  desc: string
  detalle: string
}

export default function ApoyanosPage() {
  const numeroWhatsapp = "8098373120"
  const mensajeWhatsapp = encodeURIComponent("¡Hola! Quisiera los datos de la cuenta bancaria para realizar una donación a Porcicultores RD.")
  const enlacePaypal = "https://www.paypal.com/ncp/payment/HKN7LQKA2G8BS"

  const metodos: MetodoApoyo[] = [
    {
      icon: '💬',
      titulo: 'WhatsApp Directo',
      desc: '809-837-3120',
      detalle: 'Escríbenos para solicitar la cuenta bancaria o alianzas',
    },
    {
      icon: '🏦',
      titulo: 'Cuenta Bancaria',
      desc: 'Donación por Transferencia',
      detalle: 'Solicita el número de cuenta escribiéndonos por WhatsApp',
    },
    {
      icon: '💳',
      titulo: 'PayPal / Tarjeta',
      desc: 'Monto flexible a tu gusto',
      detalle: 'Dona la cantidad que desees de forma rápida y segura',
    },
  ]

  return (
    <div
      style={{
        maxWidth: '520px',
        margin: '0 auto',
        padding: '24px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
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
              fontSize: '24px',
              fontWeight: '800',
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
            Ayúdanos a mantener viva y gratuita la comunidad porcina
          </p>
        </div>

        <Link
          href="/"
          style={{
            color: '#2563A8',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '700',
            backgroundColor: '#E0E7FF',
            padding: '8px 12px',
            borderRadius: '8px',
          }}
        >
          ← Inicio
        </Link>
      </div>

      <div
        style={{
          backgroundColor: '#FEF2F2',
          border: '1.5px solid #FECACA',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: '#991B1B',
            fontSize: '13px',
            fontWeight: '800',
            margin: '0 0 6px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          ⚠️ NOTA IMPORTANTE SOBRE LAS DONACIONES
        </p>
        <p
          style={{
            color: '#B91C1C',
            fontSize: '12px',
            fontWeight: '600',
            margin: 0,
            lineHeight: '1.5',
          }}
        >
          Este dinero es una contribución voluntaria y <strong>no será devuelto bajo ninguna circunstancia</strong>. Todo lo recaudado se utiliza directamente para mantener los servidores, desarrollar nuevas herramientas y garantizar que la plataforma siga siendo accesible para todos.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {metodos.map((m) => (
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
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
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
              <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>
                {m.detalle}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
            boxShadow: '0 4px 6px rgba(0,112,186,0.2)',
          }}
        >
          💳 Donar el monto que desees (PayPal / Tarjeta)
        </a>

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
            boxShadow: '0 4px 6px rgba(37,211,102,0.2)',
          }}
        >
          💬 Pedir Cuenta Bancaria por WhatsApp
        </a>
      </div>
    </div>
  )
}