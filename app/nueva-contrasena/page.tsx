'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function NuevaContrasena() {
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const actualizar = async () => {
    if (!password || password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setError('')
    setCargando(true)

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('Error al actualizar la contraseña. Intenta de nuevo.')
    } else {
      setEnviado(true)
    }
    setCargando(false)
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-slate-200">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Contraseña actualizada</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Tu contraseña fue actualizada exitosamente.
          </p>
          <Link
            href="/login"
            className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔑</div>
          <h1 className="text-xl font-bold text-slate-900">Nueva Contraseña</h1>
          <p className="text-slate-500 text-xs mt-1">Ingresa tu nueva contraseña de acceso</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nueva Contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              placeholder="Repite la contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && actualizar()}
              className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                confirmar && confirmar !== password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-blue-600'
              }`}
            />
            {confirmar && confirmar !== password && (
              <p className="text-red-500 text-xs mt-1 font-medium">Las contraseñas no coinciden</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={actualizar}
            disabled={cargando || !password || password !== confirmar}
            className="w-full py-3 bg-gradient-to-r from-slate-900 to-blue-900 hover:from-slate-800 hover:to-blue-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando ? '⏳ Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 text-xs font-semibold transition-all"
          >
            ← Volver al login
          </Link>
        </div>
      </div>
    </div>
  )
}