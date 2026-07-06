'use client'
import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function AdminRedirigir() {
  useEffect(() => {
    const verificar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== 'anonimusrofri@gmail.com') {
        window.location.href = '/'
      } else {
        window.location.href = '/perfil'
      }
    }
    verificar()
  }, [])
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <p>Verificando acceso...</p>
      <Link href="/" style={{ color: '#0a2463' }}>Volver al inicio</Link>
    </div>
  )
}