import Link from 'next/link'
export default function Privacidad() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '28px', fontWeight: '900', margin: 0 }}>Politica de Privacidad</h1>
        <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Inicio</Link>
      </div>
      {[
        { titulo: 'Datos que Recopilamos', texto: 'Recopilamos nombre, correo electronico, provincia, telefono y foto de perfil. Esta informacion es necesaria para que puedas usar la plataforma correctamente.' },
        { titulo: 'Uso de tus Datos', texto: 'Tus datos se usan exclusivamente para mejorar tu experiencia en Porcicultores RD. No vendemos ni compartimos tu informacion personal con terceros.' },
        { titulo: 'Tu Telefono', texto: 'Tu numero de telefono solo es visible publicamente si decides mostrarlo. Puedes editarlo o eliminarlo desde tu perfil en cualquier momento.' },
        { titulo: 'Cookies', texto: 'Usamos cookies para mantener tu sesion activa. No usamos cookies de rastreo publicitario.' },
        { titulo: 'Eliminacion de Datos', texto: 'Puedes solicitar la eliminacion de tu cuenta y todos tus datos en cualquier momento contactando al administrador de la plataforma.' },
      ].map(s => (
        <div key={s.titulo} style={{ marginBottom: '24px', backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ color: '#0a2463', fontSize: '16px', fontWeight: '800', marginBottom: '10px' }}>{s.titulo}</h2>
          <p style={{ color: '#475569', lineHeight: 1.7, margin: 0 }}>{s.texto}</p>
        </div>
      ))}
    </div>
  )
}