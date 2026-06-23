import Link from 'next/link'

export default function Privacidad() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#0a2463', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Volver al inicio</Link>
      <h1 style={{ color: '#0a2463', fontSize: '32px', fontWeight: '900', margin: '24px 0 8px' }}>Politica de Privacidad</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Porcicultores RD — Republica Dominicana</p>

      {[
        { titulo: 'Informacion que recopilamos', contenido: 'Recopilamos tu nombre, correo electronico, provincia, telefono y tipo de usuario al registrarte. Esta informacion es necesaria para el funcionamiento de la plataforma.' },
        { titulo: 'Como usamos tu informacion', contenido: 'Usamos tu informacion para mostrar tu perfil a otros usuarios, facilitar el contacto entre compradores y vendedores, y mejorar la experiencia en la plataforma. No vendemos ni compartimos tu informacion con terceros.' },
        { titulo: 'Visibilidad de tu informacion', contenido: 'Tu nombre y provincia son visibles para otros usuarios registrados. Tu telefono y WhatsApp solo son visibles si decides incluirlos en tu perfil. Tu correo electronico nunca es visible publicamente.' },
        { titulo: 'Seguridad de tus datos', contenido: 'Utilizamos Supabase como plataforma de base de datos segura con encriptacion de datos. Las contrasenas son encriptadas y nunca almacenadas en texto plano.' },
        { titulo: 'Tus derechos', contenido: 'Puedes solicitar la eliminacion de tu cuenta y todos tus datos en cualquier momento contactando a la administracion. Tienes derecho a actualizar tu informacion en cualquier momento desde tu perfil.' },
        { titulo: 'Contacto', contenido: 'Si tienes preguntas sobre nuestra politica de privacidad puedes contactarnos a traves del formulario de reportes en la plataforma.' },
      ].map((s) => (
        <div key={s.titulo} style={{ marginBottom: '28px', padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ color: '#0a2463', fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>{s.titulo}</h2>
          <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '15px' }}>{s.contenido}</p>
        </div>
      ))}
    </div>
  )
}