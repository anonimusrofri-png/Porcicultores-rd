'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default function Recuperar() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleRecuperar = async () => {
    if (!email) {
      setError('Ingresa tu correo electrónico.')
      return
    }
    setError('')
    setCargando(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nueva-contrasena`,
    })

    if (error) {
      setError('Error al enviar el correo. Verifica los datos.')
    } else {
      setEnviado(true)
    }
    setCargando(false)
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-slate-200">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Revisa tu correo</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Hemos enviado un enlace de recuperación a <strong className="text-slate-900">{email}</strong>.
          </p>
          <Link
            href="/login"
            className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
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
        <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Recuperar Contraseña</h1>
        <p className="text-slate-300 text-xs">Te enviaremos las instrucciones a tu correo</p>
      </div>

      <div className="bg-white w-full max-w-md rounded-b-2xl p-7 shadow-xl border border-t-0 border-slate-200">
        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@correo.do"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRecuperar()}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleRecuperar}
          disabled={cargando}
          className="w-full py-3 bg-gradient-to-r from-slate-900 to-blue-900 hover:from-slate-800 hover:to-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? '⏳ Enviando enlace...' : 'Enviar Enlace de Recuperación'}
        </button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 text-xs font-semibold transition-all"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}