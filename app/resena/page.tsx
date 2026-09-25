'use client'

import Link from 'next/link'

export default function Apoyanos() {
  const numeroWhatsapp = "8091234567" // Cambia por tu número de WhatsApp
  const mensajeWhatsapp = encodeURIComponent("¡Hola! Me gustaría apoyar el proyecto Porcicultores RD.")
  const enlacePaypal = "https://paypal.me/tucuenta" // Cambia por tu enlace de PayPal

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
      {/* Encabezado */}
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

      {/* Tarjeta Informativa */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px 20px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🐷</div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A3C5E', margin: '0 0 8px 0' }}>
          Porcicultores RD
        </h2>
        <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>
          Este proyecto busca conectar y fortalecer a la comunidad de productores en las 32 provincias. Tu aporte ayuda a cubrir los costos de servidores, mantenimiento y desarrollo de nuevas funciones.
        </p>
      </div>

      {/* Opciones de Contacto y Donación */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Botón WhatsApp */}
        <a
          href={`https://wa.me/${numeroWhatsapp}?text=${mensajeWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            backgroundColor: '#25D366',
            color: 'white',
            padding: '14px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '15px',
            boxShadow: '0 2px 6px rgba(37,211,102,0.2)',
          }}
        >
          💬 Contáctanos por WhatsApp
        </a>

        {/* Botón PayPal */}
        <a
          href={enlacePaypal}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            backgroundColor: '#0070BA',
            color: 'white',
            padding: '14px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '15px',
            boxShadow: '0 2px 6px rgba(0,112,186,0.2)',
          }}
        >
          💳 Donar vía PayPal
        </a>
      </div>
    </div>
  )
}