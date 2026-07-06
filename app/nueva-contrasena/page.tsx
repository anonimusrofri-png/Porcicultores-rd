'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function NuevaContrasena() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)

  const handleActualizar = async () => {
    if (password !== confirmar) {
      setError('Las contrasenas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres')
      return
    }
    setCargando(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('Error al actualizar. Intenta de nuevo.')
    } else {
      setExito(true)
      setTimeout(() => router.push('/login'), 2000)
    }
    setCargando(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Image src="/logo porcicultores rdv.jpeg" alt="Logo" width={70} height={70} style={{ objectFit: 'contain', borderRadius: '12px', marginBottom: '12px' }} />
          <h1 style={{ color: '#0a2463', fontSize: '20px', fontWeight: '900' }}>Nueva Contrasena</h1>
        </div>

        {exito ? (
          <p style={{ color: '#16a34a', textAlign: 'center', fontWeight: '700' }}>Contrasena actualizada. Redirigiendo...</p>
        ) : (
          <>
            <input type="password" placeholder="Nueva contrasena" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
            <input type="password" placeholder="Confirmar contrasena" value={confirmar} onChange={(e) => setConfirmar(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
            {error && <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '13px' }}>{error}</p>}
            <button onClick={handleActualizar} disabled={cargando}
              style={{ width: '100%', padding: '14px', backgroundColor: '#0a2463', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '800' }}>
              {cargando ? 'Actualizando...' : 'Actualizar Contrasena'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}