'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async () => {
    setCargando(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Correo o contraseña incorrectos.')
    } else {
      router.push('/')
    }
    setCargando(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/' },
    })
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      {/* Banner Header */}
      <div className="w-full max-w-md bg-gradient-to-r from-slate-900 to-blue-900 rounded-t-2xl p-8 text-center shadow-md">
        <div className="flex justify-center mb-3">
          <Image
            src="/logo porcicultores rdv.jpeg"
            alt="Logo Porcicultores RD"
            width={64}
            height={64}
            className="object-contain rounded-xl shadow-sm"
          />
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Porcicultores RD</h1>
        <p className="text-slate-300 text-xs">El Marketplace Porcino de República Dominicana</p>
      </div>

      {/* Card Content */}
      <div className="bg-white w-full max-w-md rounded-b-2xl p-7 shadow-xl border border-t-0 border-slate-200">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-6 border border-slate-200">
          <div className="flex-1 text-center py-2 bg-slate-900 text-white font-bold text-xs md:text-sm rounded-lg shadow-sm">
            Iniciar Sesión
          </div>
          <Link
            href="/registro"
            className="flex-1 text-center py-2 text-slate-500 hover:text-slate-800 font-semibold text-xs md:text-sm rounded-lg transition-all"
          >
            Registrarse
          </Link>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogle}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-sm mb-4 flex items-center justify-center gap-2.5 transition-all shadow-sm"
        >
          <span className="font-black text-blue-600 text-base">G</span> Continuar con Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-xs">o</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Form Inputs */}
        <div className="space-y-3.5 mb-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@correo.do"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="text-right mb-5">
          <Link
            href="/recuperar"
            className="text-blue-600 hover:text-blue-800 text-xs font-semibold transition-all"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={cargando}
          className="w-full py-3 bg-gradient-to-r from-slate-900 to-blue-900 hover:from-slate-800 hover:to-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? '⏳ Entrando...' : 'Iniciar Sesión'}
        </button>

        {/* Footer Prompt */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-slate-500 text-xs mb-1">¿No tienes cuenta?</p>
          <Link
            href="/registro"
            className="text-slate-900 hover:text-blue-700 font-bold text-sm transition-all"
          >
            Crear Cuenta Gratis →
          </Link>
        </div>
      </div>
    </div>
  )
}