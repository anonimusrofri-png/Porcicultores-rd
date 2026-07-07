import Link from 'next/link'
export default function Terminos() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '28px', fontWeight: '900', margin: 0 }}>Terminos y Condiciones</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>
      {[
        { titulo: 'Uso de la Plataforma', texto: 'Porcicultores RD es una plataforma de contacto entre compradores, vendedores y proveedores de servicios del sector porcino dominicano. Al registrarte, aceptas usar la plataforma de forma honesta y responsable.' },
        { titulo: 'Responsabilidad de los Usuarios', texto: 'Cada usuario es responsable de la veracidad de la informacion que publica. Porcicultores RD no participa en las negociaciones ni garantiza las transacciones realizadas entre usuarios.' },
        { titulo: 'Publicaciones', texto: 'Toda publicacion debe corresponder a animales o servicios reales. Las publicaciones falsas o engañosas seran eliminadas y la cuenta podra ser suspendida permanentemente.' },
        { titulo: 'Conducta', texto: 'Queda prohibido el acoso, amenazas, lenguaje ofensivo o cualquier conducta que afecte negativamente a otros usuarios. El administrador podra suspender cuentas que violen estas normas.' },
        { titulo: 'Modificaciones', texto: 'Porcicultores RD se reserva el derecho de modificar estos terminos en cualquier momento. Los cambios seran notificados a traves de la plataforma.' },
      ].map(s => (
        <div key={s.titulo} style={{ marginBottom: '24px', backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ color: '#0a2463', fontSize: '16px', fontWeight: '800', marginBottom: '10px' }}>{s.titulo}</h2>
          <p style={{ color: '#475569', lineHeight: 1.7, margin: 0 }}>{s.texto}</p>
        </div>
      ))}
      <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fcd34d', borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#92400e', fontSize: '13px' }}>
        Porcicultores RD no se hace responsable de estafas o negocios mal realizados entre usuarios.
      </div>
    </div>
  )
}