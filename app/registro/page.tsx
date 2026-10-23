'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegistroPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [provincia, setProvincia] = useState('')
  const [tipoUsuario, setTipoUsuario] = useState('Comprador')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('token_porcicultores', 'activo_usuario')
    window.location.href = '/'
  }

  const provinciasRD = [
    'Azua', 'Bahoruco', 'Barahona', 'Dajabón', 'Distrito Nacional', 'Duarte', 'Elías Piña', 
    'El Seibo', 'Espaillat', 'Hato Mayor', 'Hermanas Mirabal', 'Independencia', 'La Altagracia', 
    'La Romana', 'La Vega', 'María Trinidad Sánchez', 'Monseñor Nouel', 'Monte Cristi', 
    'Monte Plata', 'Pedernales', 'Peravia', 'Puerto Plata', 'Samaná', 'San Cristóbal', 
    'San José de Ocoa', 'San Juan', 'San Pedro de Macorís', 'Sánchez Ramírez', 'Santiago', 
    'Santiago Rodríguez', 'Santo Domingo', 'Valverde'
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F8FAFC', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '40px 20px',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
    }}>
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: '24px', 
        padding: '40px 32px', 
        maxWidth: '520px', 
        width: '100%', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        border: '1px solid #E2E8F0',
        boxSizing: 'border-box'
      }}>
        
        {/* Espacio reservado para el Logo del Cerdo */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/cerdo.png" 
            alt="Logo Porcicultores RD" 
            style={{ width: '70px', height: '70px', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ 
            fontSize: '26px', 
            fontWeight: '800', 
            color: '#0B2545', 
            margin: '0 0 6px 0',
            fontFamily: "Georgia, 'Times New Roman', Times, serif"
          }}>
            Crear Cuenta
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
            Únete al sector porcino dominicano
          </p>
        </div>

        <form onSubmit={handleRegister}>
          
          {/* Subir foto de perfil */}
          <div style={{ marginBottom: '20px', backgroundColor: '#F1F5F9', padding: '16px', borderRadius: '12px', border: '1px dashed #CBD5E1', textAlign: 'center' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>
              Foto de perfil <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <span style={{ display: 'block', fontSize: '12px', color: '#64748B', marginBottom: '10px' }}>
              Obligatoria para la verificación de usuario
            </span>
            <input 
              type="file" 
              accept="image/*" 
              required 
              style={{ fontSize: '13px', color: '#475569' }}
            />
          </div>

          {/* Tipo de Usuario */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
              Tipo de Usuario <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                backgroundColor: '#F8FAFC',
                outline: 'none'
              }}
            >
              <option value="Comprador">Comprador - Busco cerdos e insumos</option>
              <option value="Vendedor">Vendedor - Vendo animales porcinos</option>
              <option value="Consumidor">Consumidor - Productos procesados</option>
              <option value="Transportista">Transportista - Traslado de animales</option>
              <option value="Servicios">Servicios - Veterinario / Agroveterinaria</option>
            </select>
          </div>

          {/* Nombre completo */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Nombre completo <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input 
              type="text" 
              required
              placeholder="Ej. Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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

          {/* Correo electrónico */}
          <div style={{ marginBottom: '16px' }}>
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

          {/* Contraseña */}
          <div style={{ marginBottom: '16px' }}>
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

          {/* Teléfono / WhatsApp */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Teléfono / WhatsApp <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input 
              type="tel" 
              required
              placeholder="809-000-0000"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
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

          {/* Provincia */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Provincia <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <select
              required
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                backgroundColor: '#F8FAFC',
                outline: 'none'
              }}
            >
              <option value="">Selecciona tu provincia</option>
              {provinciasRD.map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          {/* Botón de Registro */}
          <button 
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#C81D25',
              color: '#FFFFFF',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(200, 29, 37, 0.2)',
              transition: 'background-color 0.2s ease'
            }}
          >
            Registrarse
          </button>
        </form>

        <p style={{ fontSize: '12px', color: '#64748B', textAlign: 'center', marginTop: '16px', lineHeight: '1.4' }}>
          Al registrarte aceptas nuestros <Link href="/terminos" style={{ color: '#0284C7', textDecoration: 'underline' }}>términos de uso</Link> y políticas de la plataforma.
        </p>

        {/* Enlace Iniciar Sesión */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#64748B' }}>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" style={{ color: '#0284C7', fontWeight: '700', textDecoration: 'none' }}>
              Inicia sesión
            </Link>
          </span>
        </div>

        {/* Volver al Inicio */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '13px', color: '#64748B', textDecoration: 'none' }}>
            ← Volver al Inicio
          </Link>
        </div>

      </div>
    </div>
  )
}