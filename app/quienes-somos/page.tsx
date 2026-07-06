import Link from 'next/link'

export default function QuienesSomos() {
  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: '#0a2463', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        <Link href="/" style={{ color: 'white', fontWeight: '800', fontSize: '18px', textDecoration: 'none' }}>Porcicultores RD</Link>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', textDecoration: 'none' }}>Volver al inicio</Link>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, #0a2463 0%, #1565c0 100%)', padding: '60px 32px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '16px' }}>¿Quienes Somos?</h1>
        <p style={{ fontSize: '18px', opacity: 0.85, maxWidth: '600px', margin: '0 auto' }}>Conectamos — Informamos — Hacemos Crecer</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800', marginBottom: '16px' }}>Como nacio Porcicultores RD</h2>
          <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '15px', marginBottom: '12px' }}>Porcicultores RD nacio de la necesidad real de conectar al sector porcino dominicano de manera organizada, segura y profesional. Durante anos, productores, compradores y proveedores de servicios del sector porcino en Republica Dominicana no contaban con una plataforma especializada donde pudieran encontrarse y hacer negocios de forma confiable.</p>
          <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '15px' }}>Viendo esta necesidad, nacio la idea de crear una plataforma 100% dominicana, enfocada exclusivamente en el sector porcino, donde cada usuario pueda comprar, vender, encontrar servicios y mantenerse informado sobre los precios del mercado en cada provincia del pais.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#0a2463', borderRadius: '16px', padding: '28px', color: 'white' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>Nuestra Mision</h3>
            <p style={{ opacity: 0.85, lineHeight: 1.7, fontSize: '14px' }}>Facilitar la conexion entre compradores, vendedores, productores y proveedores de servicios del sector porcino dominicano, ofreciendo una plataforma segura, organizada y de facil acceso para todos.</p>
          </div>
          <div style={{ backgroundColor: '#c1121f', borderRadius: '16px', padding: '28px', color: 'white' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>Nuestra Vision</h3>
            <p style={{ opacity: 0.85, lineHeight: 1.7, fontSize: '14px' }}>Convertirnos en el principal punto de encuentro digital del sector porcino de Republica Dominicana, contribuyendo al crecimiento y desarrollo del sector agropecuario nacional.</p>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800', marginBottom: '20px' }}>Nuestros Valores</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { titulo: 'Transparencia', desc: 'Operamos con total honestidad y claridad en cada proceso de la plataforma.' },
              { titulo: 'Seguridad', desc: 'Protegemos a nuestra comunidad con moderacion activa y sistema de reportes.' },
              { titulo: 'Confianza', desc: 'Construimos relaciones solidas entre usuarios a traves de la reputacion y verificacion.' },
              { titulo: 'Accesibilidad', desc: 'Diseno simple y claro para que cualquier persona pueda usar la plataforma facilmente.' },
            ].map((v) => (
              <div key={v.titulo} style={{ backgroundColor: '#f0f4f8', borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ color: '#0a2463', fontWeight: '800', marginBottom: '8px' }}>{v.titulo}</h4>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
          <h2 style={{ color: '#dc2626', fontSize: '22px', fontWeight: '800', marginBottom: '16px' }}>Politica Anti-Fraude</h2>
          <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '15px', marginBottom: '12px' }}>Porcicultores RD tiene tolerancia cero con el fraude, las estafas y los perfiles falsos. Toda publicacion pasa por revision administrativa antes de ser visible.</p>
          <ul style={{ color: '#475569', lineHeight: 2, fontSize: '14px', paddingLeft: '20px' }}>
            <li>Toda publicacion es revisada antes de publicarse.</li>
            <li>Los perfiles falsos son eliminados inmediatamente.</li>
            <li>Los usuarios reportados son investigados por el administrador.</li>
            <li>Las cuentas involucradas en estafas son suspendidas permanentemente.</li>
          </ul>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800', marginBottom: '16px' }}>Terminos y Condiciones</h2>
          <ul style={{ color: '#475569', lineHeight: 2, fontSize: '14px', paddingLeft: '20px' }}>
            <li>Debes proporcionar informacion veridica al registrarte.</li>
            <li>No puedes publicar animales o servicios falsos o inexistentes.</li>
            <li>Eres responsable de las transacciones que realices con otros usuarios.</li>
            <li>Porcicultores RD no participa en las negociaciones entre usuarios.</li>
            <li>El incumplimiento puede resultar en la suspension de tu cuenta.</li>
          </ul>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800', marginBottom: '16px' }}>Politica de Privacidad</h2>
          <ul style={{ color: '#475569', lineHeight: 2, fontSize: '14px', paddingLeft: '20px' }}>
            <li>Tu informacion personal no es vendida ni compartida con terceros.</li>
            <li>Solo usamos tus datos para mejorar tu experiencia en la plataforma.</li>
            <li>Tu numero de telefono solo es visible si decides mostrarlo publicamente.</li>
            <li>Puedes solicitar la eliminacion de tu cuenta en cualquier momento.</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fcd34d', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <p style={{ color: '#92400e', lineHeight: 1.8, fontSize: '14px', fontWeight: '500' }}>Porcicultores RD es una plataforma de contacto entre compradores, vendedores y proveedores de servicios. No participa en las negociaciones ni garantiza las transacciones realizadas entre usuarios. Cada usuario es responsable de verificar la informacion antes de realizar cualquier acuerdo.</p>
        </div>
      </div>

      <footer style={{ backgroundColor: '#0a2463', color: '#94a3b8', padding: '32px', textAlign: 'center', marginTop: '40px' }}>
        <p style={{ fontSize: '13px', marginBottom: '8px' }}>Porcicultores RD no se hace responsable de estafas o negocios mal realizados entre usuarios.</p>
        <p style={{ fontSize: '13px' }}>2026 Porcicultores RD - Republica Dominicana</p>
      </footer>
    </div>
  )
}