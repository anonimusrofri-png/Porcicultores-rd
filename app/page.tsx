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
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      <nav style={{ backgroundColor: '#0a2463', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Image src="/logo porcicultores rdv.jpeg" alt="Porcicultores RD" width={100} height={38} style={{ objectFit: 'contain', borderRadius: '6px' }} />
        <div className="menu-desktop" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500' }}>Marketplace</Link>
          <Link href="/directorio" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500' }}>Directorio</Link>
          <Link href="/precios" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500' }}>Precios</Link>
          <Link href="/quienes-somos" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500' }}>Quienes Somos</Link>
          <Link href="/contacto" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500' }}>Contactanos</Link>
          {usuario ? (
            <>
              <Link href="/perfil" style={{ color: 'white', fontSize: '14px', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.15)', padding: '7px 16px', borderRadius: '20px' }}>Mi Perfil</Link>
              <button onClick={handleLogout} style={{ backgroundColor: '#c1121f', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Salir</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>Entrar</Link>
              <Link href="/registro" style={{ backgroundColor: '#c1121f', color: 'white', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: '700' }}>Registrarse</Link>
            </>
          )}
        </div>
        <button className="menu-hamburguesa" onClick={() => setMenuAbierto(!menuAbierto)}
          style={{ display: 'none', background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' }}>
          {menuAbierto ? '✕' : '☰'}
        </button>
      </nav>

      {menuAbierto && (
        <div style={{ backgroundColor: '#0a2463', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: '64px', zIndex: 99 }}>
          <Link href="/marketplace" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0' }}>Marketplace</Link>
          <Link href="/comprar" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0' }}>Necesito Comprar</Link>
          <Link href="/directorio" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0' }}>Directorio</Link>
          <Link href="/precios" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0' }}>Precios</Link>
          <Link href="/chat" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0' }}>Mensajes</Link>
          <Link href="/buscar-usuarios" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0' }}>Buscar Usuarios</Link>
          <Link href="/quienes-somos" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0' }}>¿Quienes Somos?</Link>
          <Link href="/contacto" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0' }}>Contactanos</Link>
          <Link href="/apoyanos" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0' }}>Apoyanos</Link>
          {usuario ? (
            <>
              <Link href="/perfil" onClick={() => setMenuAbierto(false)} style={{ color: '#90caf9', fontSize: '15px', fontWeight: '700', padding: '8px 0' }}>Mi Perfil</Link>
              <Link href="/notificaciones" onClick={() => setMenuAbierto(false)} style={{ color: '#90caf9', fontSize: '15px', fontWeight: '700', padding: '8px 0' }}>Notificaciones</Link>
              <button onClick={() => { handleLogout(); setMenuAbierto(false) }} style={{ backgroundColor: '#c1121f', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>Salir</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuAbierto(false)} style={{ color: 'white', fontSize: '15px', fontWeight: '600', padding: '8px 0' }}>Entrar</Link>
              <Link href="/registro" onClick={() => setMenuAbierto(false)} style={{ backgroundColor: '#c1121f', color: 'white', padding: '12px', borderRadius: '10px', textAlign: 'center', fontWeight: '700', fontSize: '14px' }}>Registrarse</Link>
            </>
          )}
        </div>
      )}

      <div style={{ background: 'linear-gradient(135deg, #0a2463 0%, #1565c0 50%, #0d47a1 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(193,18,31,0.8)', borderRadius: '20px', padding: '6px 20px', fontSize: '13px', marginBottom: '20px', fontWeight: '700' }}>
          REPUBLICA DOMINICANA
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 8vw, 48px)', fontWeight: '900', marginBottom: '16px', lineHeight: 1.1 }}>El Marketplace<br/><span style={{ color: '#90caf9' }}>Porcino de RD</span></h1>
        <p style={{ fontSize: '16px', marginBottom: '40px', opacity: 0.85, maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.6 }}>Conectamos compradores, vendedores, productores y servicios del sector porcino dominicano</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/marketplace" style={{ backgroundColor: '#c1121f', color: 'white', padding: '16px 36px', borderRadius: '14px', fontWeight: '800', fontSize: '16px', textDecoration: 'none' }}>Ver Marketplace</Link>
          {!usuario && (
            <Link href="/registro" style={{ backgroundColor: 'white', color: '#0a2463', padding: '16px 36px', borderRadius: '14px', fontWeight: '800', fontSize: '16px', textDecoration: 'none' }}>Crear Cuenta Gratis</Link>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#0a2463', padding: '24px 20px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
          {[
            { numero: '32', label: 'Provincias' },
            { numero: 'Nacional', label: 'Marketplace' },
            { numero: '100%', label: 'Dominicano' },
            { numero: 'Gratis', label: 'Para todos' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ color: '#90caf9', fontSize: '24px', fontWeight: '900' }}>{s.numero}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 16px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#0a2463', fontWeight: '800', fontSize: '24px' }}>Todo lo que necesitas</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>Una plataforma completa para el sector porcino dominicano</p>
        <div className="grid-secciones" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { href: '/marketplace', titulo: 'Marketplace', desc: 'Compra y vende cerdos, lechones, cerdas y barracos', bg: '#0a2463', color: 'white' },
            { href: '/comprar', titulo: 'Necesito Comprar', desc: 'Publica lo que necesitas y los vendedores te contactaran', bg: 'white', color: '#0a2463' },
            { href: '/directorio', titulo: 'Directorio Porcino', desc: 'Veterinarias, farmacias y transportistas', bg: 'white', color: '#0a2463' },
            { href: '/precios', titulo: 'Precios del Mercado', desc: 'Precios del cerdo por provincia', bg: 'white', color: '#0a2463' },
            { href: '/buscar-usuarios', titulo: 'Buscar Usuarios', desc: 'Encuentra vendedores, transportistas y mas', bg: 'white', color: '#0a2463' },
            { href: '/apoyanos', titulo: 'Apoya Porcicultores RD', desc: 'Ayudanos a mantener y mejorar la plataforma', bg: '#c1121f', color: 'white' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: item.bg, borderRadius: '16px', padding: '20px 18px', cursor: 'pointer', border: item.bg === 'white' ? '1px solid #e2e8f0' : 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', height: '100%' }}>
                <div style={{ fontWeight: '800', color: item.color, marginBottom: '6px', fontSize: '15px' }}>{item.titulo}</div>
                <div style={{ color: item.bg === 'white' ? '#64748b' : 'rgba(255,255,255,0.8)', fontSize: '12px', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#f0f4f8', padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>Compra y vende con seguridad</h2>
        <div className="grid-seguridad" style={{ maxWidth: '700px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { titulo: 'Usuarios calificados', desc: 'Sistema de estrellas y resenas' },
            { titulo: 'Moderacion activa', desc: 'Toda publicacion es revisada' },
            { titulo: 'Sistema de reportes', desc: 'Reporta estafas y perfiles falsos' },
          ].map((s) => (
            <div key={s.titulo} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: '800', color: '#0a2463', marginBottom: '8px', fontSize: '14px' }}>{s.titulo}</div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fcd34d', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#92400e', fontSize: '13px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
          Porcicultores RD es una plataforma de contacto entre compradores, vendedores y proveedores de servicios. No participa en las negociaciones ni garantiza las transacciones realizadas entre usuarios.
        </p>
      </div>

      <footer style={{ backgroundColor: '#0a2463', color: '#94a3b8', padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Link href="/quienes-somos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '12px' }}>Quienes Somos</Link>
          <Link href="/terminos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '12px' }}>Terminos</Link>
          <Link href="/privacidad" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '12px' }}>Privacidad</Link>
          <Link href="/apoyanos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '12px' }}>Apoyanos</Link>
          <Link href="/reportar" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '12px' }}>Reportar</Link>
          <Link href="/contacto" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '12px' }}>Contactanos</Link>
          <Link href="/buscar-usuarios" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '12px' }}>Buscar Usuarios</Link>
        </div>
        <p style={{ fontSize: '12px', marginBottom: '8px' }}>Porcicultores RD no se hace responsable de estafas o negocios mal realizados entre usuarios.</p>
        <p style={{ fontSize: '12px' }}>2026 Porcicultores RD - Republica Dominicana</p>
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