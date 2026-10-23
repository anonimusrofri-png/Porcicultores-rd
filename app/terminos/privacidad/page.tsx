'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PrivacidadPage() {
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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Encabezado sin caracteres rotos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Política de Privacidad
          </h1>
          <Link href="/" style={{ color: '#0284C7', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            Volver al Inicio
          </Link>
        </div>

        {/* Datos que recopilamos */}
        <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '16px', padding: '24px', marginBottom: '16px', border: `1px solid ${t.bordeTarjeta}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: t.textPrincipal }}>
            Datos que recopilamos
          </h3>
          <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.6' }}>
            Nombre, correo electrónico, teléfono, provincia y foto de perfil. Estos datos son necesarios para la verificación de los miembros y el correcto funcionamiento de la plataforma.
          </p>
        </div>

        {/* Uso de datos */}
        <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '16px', padding: '24px', marginBottom: '16px', border: `1px solid ${t.bordeTarjeta}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: t.textPrincipal }}>
            Uso de los datos
          </h3>
          <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.6' }}>
            Tus datos se usan únicamente para mostrarte en el directorio de usuarios, facilitar el contacto comercial con otros miembros y mejorar tu experiencia en la plataforma.
          </p>
        </div>

        {/* Protección de datos */}
        <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '16px', padding: '24px', marginBottom: '16px', border: `1px solid ${t.bordeTarjeta}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: t.textPrincipal }}>
            Protección de datos
          </h3>
          <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.6' }}>
            Utilizamos cifrado SSL para proteger tu información. No vendemos ni compartimos tus datos personales con terceros.
          </p>
        </div>

        {/* Tus derechos */}
        <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '16px', padding: '24px', marginBottom: '24px', border: `1px solid ${t.bordeTarjeta}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: t.textPrincipal }}>
            Tus derechos
          </h3>
          <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.6' }}>
            Puedes solicitar la eliminación de tu cuenta y datos personales en cualquier momento contactándonos directamente.
          </p>
        </div>

        {/* Botones inferiores */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/terminos" style={{ backgroundColor: '#0284C7', color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
            Términos de Uso
          </Link>
          <Link href="/" style={{ backgroundColor: t.bgTarjeta, color: t.textPrincipal, padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: `1px solid ${t.bordeTarjeta}` }}>
            Ir al Inicio
          </Link>
        </div>

      </div>
    </div>
  )
}