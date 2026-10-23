'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Guardar el token para conceder acceso a las secciones
    localStorage.setItem('token_porcicultores', 'activo_usuario')
    window.location.href = '/'
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F8FAFC', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '20px',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
    }}>
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: '20px', 
        padding: '40px 32px', 
        maxWidth: '420px', 
        width: '100%', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        textAlign: 'center',
        border: '1px solid #E2E8F0'
      }}>
        
        {/* Imagen del Cerdo (reemplaza 'cerdo.png' con el nombre de tu archivo de imagen) */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/cerdo.png" 
            alt="Logo Porcicultores RD" 
            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            onError={(e) => {
              // Si la imagen aún no está cargada, muestra un contenedor limpio
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>

        {/* Nombre de la marca corregido */}
        <h1 style={{ 
          fontSize: '26px', 
          fontWeight: '800', 
          color: '#0B2545', 
          margin: '0 0 6px 0',
          fontFamily: "Georgia, 'Times New Roman', Times, serif"
        }}>
          Porcicultores RD
        </h1>
        
        <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 28px 0' }}>
          Ingresa a tu cuenta
        </p>

        {/* Formulario */}
        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          
          {/* Correo Electrónico corregido */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Correo electrónico <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input 
              type="email" 
              required
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#F8FAFC'
              }}
            />
          </div>

          {/* Contraseña corregido */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Contraseña <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#F8FAFC'
              }}
            />
          </div>

          {/* Botón Iniciar Sesión corregido */}
          <button 
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(2, 132, 199, 0.2)',
              transition: 'background-color 0.2s ease'
            }}
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Enlace de Registro corregido */}
        <div style={{ marginTop: '24px', fontSize: '14px' }}>
          <span style={{ color: '#0284C7', fontWeight: '600' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/registro" style={{ color: '#0284C7', textDecoration: 'underline' }}>
              Regístrate aquí
            </Link>
          </span>
        </div>

        {/* Enlace Volver al Inicio corregido (sin el signo ?) */}
        <div style={{ marginTop: '20px' }}>
          <Link href="/" style={{ fontSize: '13px', color: '#64748B', textDecoration: 'none' }}>
            ← Volver al Inicio
          </Link>
        </div>

      </div>
    </div>
  )
}