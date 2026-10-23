'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TerminosPage() {
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
            Términos de Uso
          </h1>
          <Link href="/" style={{ color: '#0284C7', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            Volver al Inicio
          </Link>
        </div>

        {/* Sección 1 */}
        <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '16px', padding: '24px', marginBottom: '16px', border: `1px solid ${t.bordeTarjeta}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: t.textPrincipal }}>
            1. Uso de la plataforma
          </h3>
          <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.6' }}>
            Porcicultores RD es una plataforma de contacto entre compradores, vendedores y proveedores de servicios del sector porcino dominicano. No participamos directamente en las negociaciones ni garantizamos las transacciones.
          </p>
        </div>

        {/* Sección 2: Moneda Obligatoria y Reportes */}
        <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '16px', padding: '24px', marginBottom: '16px', border: `1px solid ${t.bordeTarjeta}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: '#C81D25' }}>
            2. Moneda oficial (DOP) y reporte de infracciones
          </h3>
          <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.6' }}>
            Todas las publicaciones y negociaciones deben realizarse exclusivamente en <strong>Pesos Dominicanos (DOP)</strong>. Queda estrictamente prohibida la publicación de precios en dólares u otras divisas extranjeras. Si detecta a un usuario ofreciendo precios en dólares, por favor <strong>repórtelo de inmediato</strong> con la administración para suspender la cuenta infractora.
          </p>
        </div>

        {/* Sección 3 */}
        <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '16px', padding: '24px', marginBottom: '16px', border: `1px solid ${t.bordeTarjeta}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: t.textPrincipal }}>
            3. Responsabilidad y Seguridad
          </h3>
          <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.6' }}>
            Porcicultores RD no se hace responsable de estafas, fraudes o negocios mal realizados entre usuarios. Recomendamos verificar siempre la identidad de los usuarios y la calidad del ganado o producto antes de realizar pagos.
          </p>
        </div>

        {/* Sección 4 */}
        <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '16px', padding: '24px', marginBottom: '16px', border: `1px solid ${t.bordeTarjeta}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: t.textPrincipal }}>
            4. Publicaciones
          </h3>
          <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.6' }}>
            Toda publicación debe ser verídica y corresponder a animales reales disponibles para la venta. Las publicaciones falsas o engañosas serán eliminadas y el usuario podrá ser suspendido.
          </p>
        </div>

        {/* Sección 5 */}
        <div style={{ backgroundColor: t.bgTarjeta, borderRadius: '16px', padding: '24px', marginBottom: '24px', border: `1px solid ${t.bordeTarjeta}` }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: t.textPrincipal }}>
            5. Modificaciones
          </h3>
          <p style={{ fontSize: '14px', color: t.textSecundario, margin: 0, lineHeight: '1.6' }}>
            Porcicultores RD se reserva el derecho de modificar estos términos en cualquier momento. El uso continuado de la plataforma implica la aceptación de los nuevos términos.
          </p>
        </div>

        {/* Botones inferiores de navegación */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/privacidad" style={{ backgroundColor: '#0284C7', color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
            Política de Privacidad
          </Link>
          <Link href="/contacto" style={{ backgroundColor: t.bgTarjeta, color: t.textPrincipal, padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: `1px solid ${t.bordeTarjeta}` }}>
            Contacto
          </Link>
        </div>

      </div>
    </div>
  )
}