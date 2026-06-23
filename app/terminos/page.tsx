import Link from 'next/link'

export default function Terminos() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Volver al inicio</Link>
      <h1 style={{ color: '#0a2463', fontSize: '32px', fontWeight: '900', margin: '24px 0 8px' }}>Terminos y Condiciones</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Porcicultores RD — Republica Dominicana</p>

      {[
        { titulo: 'Uso de la plataforma', contenido: 'Porcicultores RD es una plataforma de contacto entre compradores, vendedores y proveedores de servicios del sector porcino dominicano. No participamos en las negociaciones ni garantizamos las transacciones realizadas entre usuarios.' },
        { titulo: 'Registro de usuarios', contenido: 'Al registrarte debes proporcionar informacion veridica y actualizada. No puedes crear cuentas falsas ni usar la identidad de otras personas. El incumplimiento resulta en la suspension permanente de tu cuenta.' },
        { titulo: 'Publicacion de anuncios', contenido: 'Toda publicacion debe ser veridica y corresponder a animales o servicios reales. Las publicaciones falsas o fraudulentas seran eliminadas y la cuenta suspendida. Toda publicacion pasa por revision antes de ser visible.' },
        { titulo: 'Responsabilidad', contenido: 'Porcicultores RD no se hace responsable de estafas, fraudes o malos negocios realizados entre usuarios. Cada usuario es responsable de verificar la informacion y tomar precauciones antes de realizar cualquier transaccion.' },
        { titulo: 'Conducta prohibida', contenido: 'Esta prohibido publicar contenido falso, realizar estafas, acosar a otros usuarios, crear perfiles falsos o usar la plataforma para actividades ilegales. El incumplimiento resulta en suspension permanente.' },
        { titulo: 'Modificaciones', contenido: 'Porcicultores RD se reserva el derecho de modificar estos terminos en cualquier momento. Los cambios seran notificados a los usuarios registrados.' },
      ].map((s) => (
        <div key={s.titulo} style={{ marginBottom: '28px', padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ color: '#0a2463', fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>{s.titulo}</h2>
          <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '15px' }}>{s.contenido}</p>
        </div>
      ))}
    </div>
  )
}