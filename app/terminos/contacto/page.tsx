'use client'
import Link from 'next/link'

export default function Contacto() {
  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F6F9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: 0 }}>\uD83D\uDCDE Cont\u00e1ctanos</h1>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>\u2190 Inicio</Link>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #1A3C5E, #2563A8)', borderRadius: '16px', padding: '24px', marginBottom: '16px', color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>\uD83D\uDC37</div>
        <h2 style={{ fontWeight: '700', fontSize: '18px', margin: '0 0 6px 0' }}>Estamos para ayudarte</h2>
        <p style={{ opacity: 0.85, fontSize: '13px', margin: 0 }}>Responderemos en menos de 24 horas</p>
      </div>
      {[
        { icon: '\uD83D\uDCAC', titulo: 'WhatsApp', valor: '+1 (809) 000-0000', href: 'https://wa.me/18090000000', btn: 'Escribir por WhatsApp', bg: '#25D366' },
        { icon: '\uD83D\uDCE7', titulo: 'Correo Electr\u00f3nico', valor: 'info@porcicultoresrd.com', href: 'mailto:info@porcicultoresrd.com', btn: 'Enviar correo', bg: '#1A3C5E' },
      ].map(c => (
        <div key={c.titulo} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '20px', marginBottom: '12px', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>{c.icon}</span>
            <div>
              <p style={{ fontWeight: '700', color: '#111827', fontSize: '14px', margin: 0 }}>{c.titulo}</p>
              <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>{c.valor}</p>
            </div>
          </div>
          <a href={c.href} target="_blank" style={{ display: 'block', backgroundColor: c.bg, color: 'white', padding: '11px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>{c.btn}</a>
        </div>
      ))}
      <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontSize: '12px', margin: 0, lineHeight: 1.7 }}>Horario de atenci\u00f3n: Lunes a Viernes 8am - 6pm\nS\u00e1bado 8am - 12pm</p>
      </div>
    </div>
  )
}
