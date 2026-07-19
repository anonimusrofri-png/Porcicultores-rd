'use client'
import Link from 'next/link'

export default function QuienesSomos() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F6F9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: '0 0 2px 0' }}>\uD83D\uDC37 Qui\u00e9nes Somos</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Conoce Porcicultores RD</p>
        </div>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>\u2190 Inicio</Link>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #1A3C5E, #2563A8)', borderRadius: '16px', padding: '28px', marginBottom: '16px', color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>\uD83D\uDC37</div>
        <h2 style={{ fontWeight: '700', fontSize: '22px', margin: '0 0 8px 0' }}>Porcicultores RD</h2>
        <p style={{ opacity: 0.85, fontSize: '14px', lineHeight: 1.7, margin: 0 }}>La plataforma digital del sector porcino dominicano. Conectamos compradores, vendedores, productores y servicios en toda la Rep\u00fablica Dominicana.</p>
      </div>
      {[
        { icon: '\uD83C\uDFAF', titulo: 'Nuestra Misi\u00f3n', texto: 'Facilitar el comercio y la comunicaci\u00f3n del sector porcino dominicano a trav\u00e9s de una plataforma segura, moderna y accesible para todos.' },
        { icon: '\uD83D\uDC40', titulo: 'Nuestra Visi\u00f3n', texto: 'Ser la plataforma de referencia del sector porcino en Rep\u00fablica Dominicana, promoviendo el desarrollo y la profesionalizaci\u00f3n del sector.' },
        { icon: '\uD83E\uDD1D', titulo: '\u00bfA qui\u00e9n servimos?', texto: 'Compradores, vendedores, consumidores, transportistas, veterinarias, farmacias veterinarias y todos los actores del sector porcino dominicano.' },
        { icon: '\uD83D\uDEE1\uFE0F', titulo: 'Seguridad y Confianza', texto: 'Contamos con sistema de reputaci\u00f3n por estrellas, moderaci\u00f3n de publicaciones y sistema de reportes para mantener una comunidad segura.' },
      ].map(s => (
        <div key={s.titulo} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '20px', marginBottom: '12px', border: '1px solid #E5E7EB', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '28px', flexShrink: 0 }}>{s.icon}</span>
          <div>
            <h3 style={{ color: '#1A3C5E', fontWeight: '700', fontSize: '15px', margin: '0 0 6px 0' }}>{s.titulo}</h3>
            <p style={{ color: '#6B7280', fontSize: '13px', margin: 0, lineHeight: 1.7 }}>{s.texto}</p>
          </div>
        </div>
      ))}
      <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#374151', fontSize: '13px', margin: '0 0 14px 0', lineHeight: 1.7 }}>
          \u00bfTienes preguntas o sugerencias? Contactanos directamente.
        </p>
        <Link href="/terminos/contacto" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '10px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>Contactar</Link>
      </div>
    </div>
  )
}
