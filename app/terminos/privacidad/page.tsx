'use client'
import Link from 'next/link'

export default function Privacidad() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F6F9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: 0 }}>\uD83D\uDD12 Pol\u00edtica de Privacidad</h1>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>\u2190 Inicio</Link>
      </div>
      {[
        { titulo: 'Datos que recopilamos', texto: 'Nombre, correo electr\u00f3nico, tel\u00e9fono, provincia y foto de perfil. Estos datos son necesarios para el funcionamiento de la plataforma.' },
        { titulo: 'Uso de los datos', texto: 'Tus datos se usan \u00fanicamente para mostrarte en el directorio de usuarios, facilitar el contacto con otros usuarios y mejorar tu experiencia en la plataforma.' },
        { titulo: 'Protecci\u00f3n de datos', texto: 'Utilizamos Supabase con cifrado SSL para proteger tu informaci\u00f3n. No vendemos ni compartimos tus datos con terceros.' },
        { titulo: 'Tus derechos', texto: 'Puedes solicitar la eliminaci\u00f3n de tu cuenta y datos en cualquier momento contact\u00e1ndonos directamente.' },
      ].map(s => (
        <div key={s.titulo} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '20px', marginBottom: '12px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ color: '#1A3C5E', fontWeight: '700', fontSize: '14px', margin: '0 0 8px 0' }}>{s.titulo}</h3>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0, lineHeight: 1.7 }}>{s.texto}</p>
        </div>
      ))}
    </div>
  )
}
