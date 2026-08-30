'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Login() {
  const [esRegistro, setEsRegistro] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    if (esRegistro) {
      if (!nombre || !telefono) {
        setError('Por favor completa todos los campos requeridos')
        setCargando(false)
        return
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
        setCargando(false)
        return
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('perfiles')
          .upsert({
            id: data.user.id,
            nombre,
            telefono,
          })

        if (profileError) {
          console.error('Error guardando perfil:', profileError.message)
        }
        window.location.href = '/perfil'
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
      } else {
        window.location.href = '/perfil'
      }
    }
    setCargando(false)
  }

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', fontFamily: "'Inter', sans-serif", backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 20px', boxShadow: '0 0 20px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
      
      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🐷</div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0253A3', margin: '0 0 6px 0' }}>Porcicultores RD</h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          {esRegistro ? 'Crea tu cuenta para publicar' : 'Ingresa a tu cuenta'}
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {esRegistro && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                Nombre completo <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                Teléfono / WhatsApp <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Ej. 8091234567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
            Correo electrónico <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="email"
            required
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
            Contraseña <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 12px', color: '#DC2626', fontSize: '12px', fontWeight: '500' }}>
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
          style={{ width: '100%', padding: '14px', backgroundColor: cargando ? '#94A3B8' : '#0253A3', color: 'white', border: 'none', borderRadius: '12px', cursor: cargando ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: '700', marginTop: '6px', boxShadow: '0 4px 12px rgba(2, 83, 163, 0.2)' }}>
          {cargando ? '⏳ Procesando...' : esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* Cambiar entre Login y Registro */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button
          onClick={() => {
            setEsRegistro(!esRegistro)
            setError('')
          }}
          style={{ background: 'none', border: 'none', color: '#0253A3', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
          {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link href="/" style={{ color: '#64748B', fontSize: '12px', textDecoration: 'none' }}>
          ← Volver al Inicio
        </Link>
      </div>

    </div>
  )
}