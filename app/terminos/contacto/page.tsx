'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ContactoPage() {
  const [esOscuro, setEsOscuro] = useState(true)

  useEffect(() => {
    const temaGuardado = localStorage.getItem('tema_porcicultores')
    if (temaGuardado) {
      setEsOscuro(temaGuardado === 'oscuro')
    }
  }, [])

  const t = {
    bgPrincipal: esOscuro ? '#0B132B' : '#F8FAFC',
    textPrincipal: esOscuro ? '#FFFFFF' : '#0F172A',
    textSecundario: esOscuro ? '#94A3B8' : '#64748B',
    bgTarjeta: esOscuro ? '#111936' : '#FFFFFF',
    bordeTarjeta: esOscuro ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: t.bgPrincipal, fontFamily: "system-ui, -apple-system, sans-serif", margin: 0, padding: '40px 20px', color: t.textPrincipal }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Encabezado limpio */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Contáctanos
          </h1>
          <Link href="/" style={{ color: '#0284C7', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            ← Volver al Inicio
          </Link>
        </div>

        {/* Tarjeta Destacada */}
        <div style={{ backgroundColor: '#0284C7', borderRadius: '20px', padding: '32px 24px', textAlign: 'center', color: '#FFFFFF', marginBottom: '24px', boxShadow: '0 10px 25px rgba(2, 132, 199, 0.2)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0' }}>
            Estamos para ayudarte
          </h2>
          <p style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>
            Responderemos en menos de 24 horas
          </p>
        </div>

        {/* Tarjeta de WhatsApp */}
        <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '16px', padding: '24px', marginBottom: '16px', border: `1px solid ${t.bordeTarjeta}` }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: t.textSecundario, textTransform: 'uppercase', letterSpacing: '0.5px' }}>WhatsApp</span>
            <div style={{ fontSize: '18px', fontWeight: '700', color: t.textPrincipal, marginTop: '4px' }}>
              +1 (809) 837-3120
            </div>
          </div>
          <a 
            href="https://wa.me/18098373120" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              padding: '12px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '14px',
              boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
            }}
          >
            Escribir por WhatsApp
          </a>
        </div>

        {/* Tarjeta de Correo Electrónico */}
        <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '16px', padding: '24px', marginBottom: '16px', border: `1px solid ${t.bordeTarjeta}` }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: t.textSecundario, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Correo Electrónico</span>
            <div style={{ fontSize: '16px', fontWeight: '700', color: t.textPrincipal, marginTop: '4px' }}>
              nexobrandsp@gmail.com
            </div>
          </div>
          <a 
            href="mailto:nexobrandsp@gmail.com"
            style={{
              display: 'block',
              textAlign: 'center',
              backgroundColor: '#0B2545',
              color: '#FFFFFF',
              padding: '12px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '14px'
            }}
          >
            Enviar correo
          </a>
        </div>

        {/* Horario de Atención */}
        <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '16px', padding: '20px', textAlign: 'center', border: `1px solid ${t.bordeTarjeta}` }}>
          <p style={{ fontSize: '13px', color: t.textSecundario, margin: 0, lineHeight: '1.5' }}>
            Horario de atención: Lunes a Viernes 8:00 AM - 6:00 PM | Sábado 8:00 AM - 12:00 PM
          </p>
        </div>

        {/* Enlaces inferiores */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
          <Link href="/terminos" style={{ color: '#0284C7', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
            Términos de Uso
          </Link>
          <span style={{ color: t.textSecundario }}>•</span>
          <Link href="/terminos/privacidad" style={{ color: '#0284C7', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
            Política de Privacidad
          </Link>
        </div>

      </div>
    </div>
  )
}