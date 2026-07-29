'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [usuario, setUsuario] = useState<any>(null)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUsuario(user))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUsuario(null)
    setMenuAbierto(false)
  }

  const secciones = [
    { href: '/marketplace', titulo: 'Marketplace', desc: 'Compra y vende cerdos, lechones, cerdas y barracos', bg: '#1A3C5E', color: 'white' },
    { href: '/comprar', titulo: 'Necesito Comprar', desc: 'Publica lo que necesitas y los vendedores te contactar\u00e1n', bg: 'white', color: '#1A3C5E' },
    { href: '/directorio', titulo: 'Directorio Porcino', desc: 'Veterinarias, farmacias y transportistas', bg: 'white', color: '#1A3C5E' },
    { href: '/precios', titulo: 'Precios del Mercado', desc: 'Precios del cerdo por provincia actualizados', bg: 'white', color: '#1A3C5E' },
    { href: '/buscar-usuarios', titulo: 'Buscar Usuarios', desc: 'Encuentra vendedores, transportistas y m\u00e1s', bg: 'white', color: '#1A3C5E' },
    { href: '/apoyanos', titulo: 'Ap\u00f3yanos', desc: 'Ay\u00fadanos a mantener y mejorar la plataforma', bg: '#EF4444', color: 'white' },
  ]

  const navLinks = [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/directorio', label: 'Directorio' },
    { href: '/precios', label: 'Precios' },
    { href: '/quienes-somos', label: 'Qui\u00e9nes Somos' },
    { href: '/terminos/contacto', label: 'Cont\u00e1ctanos' },
  ]

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', backgroundColor: '#F4F6F9' }}>

      <nav style={{ backgroundColor: '#1A3C5E', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/">
          <Image src="/logo porcicultores rdv.jpeg" alt="Porcicultores RD" width={100} height={38} style={{ objectFit: 'contain', borderRadius: '6px' }} />
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }} className="menu-desktop">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>{l.label}</Link>
          ))}
          {usuario ? (
            <>
              <Link href="/perfil" style={{ color: 'white', fontSize: '14px', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.15)', padding: '7px 16px', borderRadius: '20px', textDecoration: 'none' }}>Mi Perfil</Link>
              <button onClick={handleLogout} style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Salir</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: 'white', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>Entrar</Link>
              <Link href="/registro" style={{ backgroundColor: '#EF4444', color: 'white', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>Registrarse</Link>
            </>
          )}
        </div>
        <button className="menu-hamburguesa" onClick={() => setMenuAbierto(!menuAbierto)}
          style={{ display: 'none', background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' }}>
          {menuAbierto ? '\u2715' : '\u2630'}
        </button>
      </nav>

      {menuAbierto && (
        <div style={{ backgroundColor: '#1A3C5E', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: '64px', zIndex: 99 }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0', textDecoration: 'none' }}>{l.label}</Link>
          ))}
          <Link href="/comprar" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0', textDecoration: 'none' }}>Necesito Comprar</Link>
          <Link href="/chat" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0', textDecoration: 'none' }}>Mensajes</Link>
          <Link href="/transportistas" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0', textDecoration: 'none' }}>Transportistas</Link>
          <Link href="/apoyanos" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0', textDecoration: 'none' }}>Ap\u00f3yanos</Link>
          {usuario ? (
            <>
              <Link href="/perfil" onClick={() => setMenuAbierto(false)} style={{ color: '#90CAF9', fontSize: '15px', fontWeight: '700', padding: '8px 0', textDecoration: 'none' }}>Mi Perfil</Link>
              <Link href="/notificaciones" onClick={() => setMenuAbierto(false)} style={{ color: '#90CAF9', fontSize: '15px', fontWeight: '700', padding: '8px 0', textDecoration: 'none' }}>Notificaciones</Link>
              <button onClick={handleLogout} style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>Salir</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0', textDecoration: 'none' }}>Entrar</Link>
              <Link href="/registro" onClick={() => setMenuAbierto(false)} style={{ backgroundColor: '#EF4444', color: 'white', padding: '12px', borderRadius: '10px', textAlign: 'center', fontWeight: '700', fontSize: '14px', textDecoration: 'none', display: 'block' }}>Registrarse</Link>
            </>
          )}
        </div>
      )}

      <div style={{ background: 'linear-gradient(135deg, #1A3C5E 0%, #2563A8 50%, #1B5E20 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(239,68,68,0.8)', borderRadius: '20px', padding: '6px 20px', fontSize: '13px', marginBottom: '20px', fontWeight: '700' }}>
          REP\u00daBLICA DOMINICANA
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 8vw, 48px)', fontWeight: '900', marginBottom: '16px', lineHeight: 1.1 }}>
          El Marketplace<br/><span style={{ color: '#90CAF9' }}>Porcino de RD</span>
        </h1>
        <p style={{ fontSize: '16px', marginBottom: '40px', opacity: 0.85, maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          Conectamos compradores, vendedores, productores y servicios del sector porcino dominicano
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/marketplace" style={{ backgroundColor: '#EF4444', color: 'white', padding: '16px 36px', borderRadius: '14px', fontWeight: '800', fontSize: '16px', textDecoration: 'none' }}>Ver Marketplace</Link>
          {!usuario && (
            <Link href="/registro" style={{ backgroundColor: 'white', color: '#1A3C5E', padding: '16px 36px', borderRadius: '14px', fontWeight: '800', fontSize: '16px', textDecoration: 'none' }}>Crear Cuenta Gratis</Link>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#1A3C5E', padding: '24px 20px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
          {[
            { numero: '32', label: 'Provincias' },
            { numero: 'Nacional', label: 'Marketplace' },
            { numero: '100%', label: 'Dominicano' },
            { numero: 'Gratis', label: 'Para todos' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ color: '#90CAF9', fontSize: '24px', fontWeight: '900' }}>{s.numero}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 16px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#1A3C5E', fontWeight: '800', fontSize: '24px' }}>Todo lo que necesitas</h2>
        <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '24px', fontSize: '14px' }}>Una plataforma completa para el sector porcino dominicano</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="grid-secciones">
          {secciones.map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: item.bg, borderRadius: '16px', padding: '20px 18px', cursor: 'pointer', border: item.bg === 'white' ? '1px solid #E5E7EB' : 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', height: '100%' }}>
                <div style={{ fontWeight: '800', color: item.color, marginBottom: '6px', fontSize: '15px' }}>{item.titulo}</div>
                <div style={{ color: item.bg === 'white' ? '#6B7280' : 'rgba(255,255,255,0.8)', fontSize: '12px', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#EFF6FF', padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#1A3C5E', fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>Compra y vende con seguridad</h2>
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="grid-seguridad">
          {[
            { titulo: 'Usuarios calificados', desc: 'Sistema de estrellas y rese\u00f1as' },
            { titulo: 'Moderaci\u00f3n activa', desc: 'Toda publicaci\u00f3n es revisada' },
            { titulo: 'Sistema de reportes', desc: 'Reporta estafas y perfiles falsos' },
          ].map(s => (
            <div key={s.titulo} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #BFDBFE' }}>
              <div style={{ fontWeight: '800', color: '#1A3C5E', marginBottom: '8px', fontSize: '14px' }}>{s.titulo}</div>
              <div style={{ color: '#6B7280', fontSize: '12px' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#92400E', fontSize: '13px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
          Porcicultores RD es una plataforma de contacto entre compradores, vendedores y proveedores de servicios. No participa en las negociaciones ni garantiza las transacciones realizadas entre usuarios.
        </p>
      </div>

      <footer style={{ backgroundColor: '#1A3C5E', color: '#94A3B8', padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { href: '/quienes-somos', label: 'Qui\u00e9nes Somos' },
            { href: '/terminos', label: 'T\u00e9rminos' },
            { href: '/terminos/privacidad', label: 'Privacidad' },
            { href: '/apoyanos', label: 'Ap\u00f3yanos' },
            { href: '/reportar', label: 'Reportar' },
            { href: '/terminos/contacto', label: 'Cont\u00e1ctanos' },
            { href: '/buscar-usuarios', label: 'Buscar Usuarios' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '12px' }}>{l.label}</Link>
          ))}
        </div>
        <p style={{ fontSize: '12px', marginBottom: '8px' }}>Porcicultores RD no se hace responsable de estafas o negocios mal realizados entre usuarios.</p>
        <p style={{ fontSize: '12px' }}>\u00a9 2026 Porcicultores RD \u2014 Rep\u00fablica Dominicana</p>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .menu-desktop { display: none !important; }
          .menu-hamburguesa { display: block !important; }
          .grid-secciones { grid-template-columns: 1fr !important; }
          .grid-seguridad { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
