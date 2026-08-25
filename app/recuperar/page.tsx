'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Recuperar() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const enviar = async () => {
    if (!email) return
    setError('')
    setCargando(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://porcicultores-rd.vercel.app/nueva-contrasena',
    })
    if (error) {
      setError('Error al enviar el correo. Verifica la dirección e inténtalo de nuevo.')
    } else {
      setEnviado(true)
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-slate-200">
        {enviado ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Correo enviado</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.
            </p>
            <Link
              href="/login"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              Volver al Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔑</div>
              <h1 className="text-xl font-bold text-slate-900">Recuperar Contraseña</h1>
              <p className="text-slate-500 text-xs mt-1">
                Ingresa tu correo y te enviaremos un enlace de recuperación
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.do"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && enviar()}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={enviar}
                disabled={cargando || !email}
                className="w-full py-3 bg-gradient-to-r from-slate-900 to-blue-900 hover:from-slate-800 hover:to-blue-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? '⏳ Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </div>

            <div className="text-center mt-6">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 text-xs font-semibold transition-all"
              >
                ← Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
