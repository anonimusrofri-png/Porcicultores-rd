'use client'
import Link from 'next/link'

export default function Apoyanos() {
  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F6F9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: '0 0 2px 0' }}>\u2764\uFE0F Ap\u00f3yanos</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Ayuda a mantener Porcicultores RD</p>
        </div>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>\u2190 Inicio</Link>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #1A3C5E, #2563A8)', borderRadius: '16px', padding: '28px', marginBottom: '20px', color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>\uD83D\uDC37</div>
        <h2 style={{ fontWeight: '700', fontSize: '20px', margin: '0 0 8px 0' }}>Porcicultores RD es gratuito</h2>
        <p style={{ opacity: 0.85, fontSize: '14px', lineHeight: 1.7, margin: 0 }}>Tu apoyo nos permite mantener la plataforma activa, segura y en constante mejora para toda la comunidad porcina dominicana.</p>
      </div>
      {[
      ,
        { icon: '\uD83D\uDCF1', titulo: 'PayPal', desc: 'Donación Rapida y segura', detalle: 'paypal.me/porcicultoresrd' },
      ].map(m => (
        <div key={m.titulo} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '20px', marginBottom: '12px', border: '1px solid #E5E7EB', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '28px', flexShrink: 0 }}>{m.icon}</span>
          <div>
            <h3 style={{ color: '#1A3C5E', fontWeight: '700', fontSize: '15px', margin: '0 0 4px 0' }}>{m.titulo}</h3>
            <p style={{ color: '#6B7280', fontSize: '12px', margin: '0 0 6px 0' }}>{m.desc}</p>
            <p style={{ color: '#374151', fontSize: '13px', margin: 0, fontFamily: 'monospace', backgroundColor: '#F9FAFB', padding: '8px 12px', borderRadius: '8px', whiteSpace: 'pre-line' }}>{m.detalle}</p>
          </div>
        </div>
      ))}
      <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
        <p style={{ color: '#92400E', fontSize: '13px', margin: 0, lineHeight: 1.7 }}>
          Cada aporte, por pequeño que sea, hace una gran diferencia. Gracias por apoyar el sector porcino dominicano!
        </p>
      </div>
    </div>
  )
}
