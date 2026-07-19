'use client'
import Link from 'next/link'

export default function Terminos() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F6F9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: 0 }}>\uD83D\uDCDC T\u00e9rminos de Uso</h1>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>\u2190 Inicio</Link>
      </div>
      {[
        { titulo: '1. Uso de la plataforma', texto: 'Porcicultores RD es una plataforma de contacto entre compradores, vendedores y proveedores de servicios del sector porcino dominicano. No participamos directamente en las negociaciones ni garantizamos las transacciones.' },
        { titulo: '2. Responsabilidad', texto: 'Porcicultores RD no se hace responsable de estafas, fraudes o negocios mal realizados entre usuarios. Recomendamos verificar siempre la identidad de los usuarios antes de realizar pagos o transacciones.' },
        { titulo: '3. Publicaciones', texto: 'Toda publicaci\u00f3n debe ser verídica y corresponder a animales reales disponibles para la venta. Las publicaciones falsas o enga\u00f1osas ser\u00e1n eliminadas y el usuario podr\u00e1 ser suspendido.' },
        { titulo: '4. Comportamiento', texto: 'Los usuarios deben comportarse de manera respetuosa. Queda prohibido el acoso, amenazas, difamaci\u00f3n o cualquier comportamiento inapropiado dentro de la plataforma.' },
        { titulo: '5. Modificaciones', texto: 'Porcicultores RD se reserva el derecho de modificar estos t\u00e9rminos en cualquier momento. El uso continuado de la plataforma implica la aceptaci\u00f3n de los nuevos t\u00e9rminos.' },
      ].map(s => (
        <div key={s.titulo} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '20px', marginBottom: '12px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ color: '#1A3C5E', fontWeight: '700', fontSize: '14px', margin: '0 0 8px 0' }}>{s.titulo}</h3>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0, lineHeight: 1.7 }}>{s.texto}</p>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
        <Link href="/terminos/privacidad" style={{ flex: 1, backgroundColor: '#1A3C5E', color: 'white', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '13px', textAlign: 'center' }}>Privacidad</Link>
        <Link href="/terminos/contacto" style={{ flex: 1, backgroundColor: 'white', color: '#1A3C5E', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '13px', textAlign: 'center', border: '1px solid #E5E7EB' }}>Contacto</Link>
      </div>
    </div>
  )
}
