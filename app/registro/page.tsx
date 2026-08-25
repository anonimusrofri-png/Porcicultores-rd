'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const provincias = [
  'Azua', 'Bahoruco', 'Barahona', 'Dajabón', 'Distrito Nacional', 'Duarte', 'Elías Piña',
  'El Seibo', 'Espaillat', 'Hato Mayor', 'Hermanas Mirabal', 'Independencia', 'La Altagracia',
  'La Romana', 'La Vega', 'María Trinidad Sánchez', 'Monseñor Nouel', 'Monte Cristi',
  'Monte Plata', 'Pedernales', 'Peravia', 'Puerto Plata', 'Samaná', 'San Cristóbal',
  'San José de Ocoa', 'San Juan', 'San Pedro de Macorís', 'Sánchez Ramírez', 'Santiago',
  'Santiago Rodríguez', 'Santo Domingo', 'Valverde'
]

const CLAVE_ADMIN = 'PRD-2026-ADM'

export default function Registro() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tipo, setTipo] = useState('comprador')
  const [provincia, setProvincia] = useState('')
  const [telefono, setTelefono] = useState('')
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null)
  const [previstaFoto, setPrevistaFoto] = useState<string | null>(null)
  const [claveAdmin, setClaveAdmin] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFotoPerfil(file)
      setPrevistaFoto(URL.createObjectURL(file))
    }
  }

  const handleRegistro = async () => {
    if (!nombre || !email || !password || !provincia) {
      setError('Por favor completa todos los campos obligatorios.')
      return
    }
    if (!fotoPerfil) {
      setError('La foto de perfil es obligatoria.')
      return
    }
    if (tipo === 'admin' && claveAdmin !== CLAVE_ADMIN) {
      setError('Clave de acceso incorrecta.')
      return
    }

    setCargando(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) {
      setError(authError.message)
      setCargando(false)
      return
    }

    if (data.user) {
      let fotoUrl = null
      const ext = fotoPerfil.name.split('.').pop()
      const fileName = `perfil_${data.user.id}_${Date.now()}.${ext}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('publicaciones')
        .upload(fileName, fotoPerfil)

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('publicaciones').getPublicUrl(fileName)
        fotoUrl = urlData.publicUrl
      }

      const { error: perfilError } = await supabase.from('perfiles').upsert({
        id: data.user.id,
        nombre,
        tipo: tipo === 'admin' ? 'admin' : tipo,
        provincia,
        telefono,
        whatsapp: telefono,
        foto_perfil: fotoUrl,
        es_admin: tipo === 'admin',
      })

      if (perfilError) {
        setError('Error al crear el perfil: ' + perfilError.message)
        setCargando(false)
        return
      }

      router.push('/')
    }
    setCargando(false)
  }

  const tiposUsuario = [
    { valor: 'comprador', label: '🛒 Comprador', desc: 'Busco cerdos para comprar' },
    { valor: 'vendedor', label: '🐷 Vendedor', desc: 'Vendo animales porcinos' },
    { valor: 'consumidor', label: '🍽️ Consumidor', desc: 'Consumo productos porcinos' },
    { valor: 'transportista', label: '🚛 Transportista', desc: 'Traslado animales' },
    { valor: 'admin', label: '⚙️ Administrador', desc: 'Gestión de la plataforma' },
  ]

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      {/* Banner Header */}
      <div className="w-full max-w-lg bg-gradient-to-r from-slate-900 to-blue-900 rounded-t-2xl p-8 text-center shadow-md">
        <div className="flex justify-center mb-3">
          <Image
            src="/logo porcicultores rdv.jpeg"
            alt="Logo Porcicultores RD"
            width={64}
            height={64}
            className="object-contain rounded-xl shadow-sm"
          />
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Crear Cuenta</h1>
        <p className="text-slate-300 text-xs">Únete al sector porcino dominicano</p>
      </div>

      {/* Card Body */}
      <div className="bg-white w-full max-w-lg rounded-b-2xl p-7 shadow-xl border border-t-0 border-slate-200">
        {/* Tab Navigation */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-6 border border-slate-200">
          <Link
            href="/login"
            className="flex-1 text-center py-2 text-slate-500 hover:text-slate-800 font-semibold text-xs md:text-sm rounded-lg transition-all"
          >
            Iniciar Sesión
          </Link>
          <div className="flex-1 text-center py-2 bg-slate-900 text-white font-bold text-xs md:text-sm rounded-lg shadow-sm">
            Registrarse
          </div>
        </div>

        {/* Upload Profile Picture */}
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-slate-900 mb-0.5">
            Foto de perfil <span className="text-red-500">*</span>
          </p>
          <p className="text-[11px] text-slate-500 mb-3">Obligatoria para la verificación</p>
          <div
            onClick={() => document.getElementById('inputFotoReg')?.click()}
            className={`w-22 h-22 rounded-full border-2 border-dashed mx-auto cursor-pointer overflow-hidden flex items-center justify-center transition-all ${
              fotoPerfil
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
            }`}
          >
            {previstaFoto ? (
              <img src={previstaFoto} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="text-2xl mb-0.5">📷</div>
                <div className="text-[10px] text-blue-600 font-semibold">Subir foto</div>
              </div>
            )}
          </div>
          {fotoPerfil && (
            <p className="text-[11px] text-emerald-600 mt-1.5 font-semibold">✅ Foto cargada</p>
          )}
          <input id="inputFotoReg" type="file" accept="image/*" onChange={handleFoto} className="hidden" />
        </div>

        {/* User Type Selection */}
        <p className="text-xs font-semibold text-slate-900 mb-2.5">Tipo de usuario</p>
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {tiposUsuario.map((t) => (
            <div
              key={t.valor}
              onClick={() => {
                setTipo(t.valor)
                setClaveAdmin('')
              }}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                t.valor === 'admin' ? 'col-span-2' : 'col-span-1'
              } ${
                tipo === t.valor
                  ? t.valor === 'admin'
                    ? 'border-emerald-700 bg-emerald-50'
                    : 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="font-bold text-xs text-slate-900 mb-0.5">{t.label}</div>
              <div className="text-[11px] text-slate-500">{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Admin Secret Key */}
        {tipo === 'admin' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-emerald-900 mb-1">🔐 Acceso restringido</p>
            <p className="text-xs text-slate-600 mb-3">
              Ingresa la clave de autorización para continuar
            </p>
            <input
              type="password"
              placeholder="Clave de autorización"
              value={claveAdmin}
              onChange={(e) => setClaveAdmin(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white focus:outline-none transition-all ${
                claveAdmin && claveAdmin !== CLAVE_ADMIN ? 'border-red-500' : 'border-slate-200'
              }`}
            />
            {claveAdmin && claveAdmin === CLAVE_ADMIN && (
              <p className="text-xs text-emerald-600 mt-1.5 font-semibold">✅ Clave correcta</p>
            )}
            {claveAdmin && claveAdmin !== CLAVE_ADMIN && (
              <p className="text-xs text-red-500 mt-1.5">❌ Clave incorrecta</p>
            )}
          </div>
        )}

        {/* Text Inputs */}
        <div className="space-y-3 mb-3">
          {[
            { placeholder: 'Nombre completo *', value: nombre, onChange: setNombre, type: 'text' },
            { placeholder: 'Correo electrónico *', value: email, onChange: setEmail, type: 'email' },
            { placeholder: 'Contraseña *', value: password, onChange: setPassword, type: 'password' },
            { placeholder: 'Teléfono / WhatsApp', value: telefono, onChange: setTelefono, type: 'tel' },
          ].map((campo) => (
            <input
              key={campo.placeholder}
              type={campo.type}
              placeholder={campo.placeholder}
              value={campo.value}
              onChange={(e) => campo.onChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          ))}
        </div>

        {/* Province Select */}
        <div className="mb-5">
          <select
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all ${
              provincia ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            <option value="">Selecciona tu provincia *</option>
            {provincias.map((p) => (
              <option key={p} value={p} className="text-slate-900">
                {p}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleRegistro}
          disabled={cargando}
          className="w-full py-3 bg-gradient-to-r from-slate-900 to-blue-900 hover:from-slate-800 hover:to-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? '⏳ Creando cuenta...' : 'Crear Cuenta'}
        </button>

        {/* Terms footer */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-center">
          <p className="text-slate-500 text-xs leading-relaxed">
            ℹ️ Al registrarte aceptas nuestros{' '}
            <Link href="/terminos" className="text-blue-600 font-semibold hover:underline">
              términos de uso
            </Link>{' '}
            y{' '}
            <Link href="/terminos/privacidad" className="text-blue-600 font-semibold hover:underline">
              política de privacidad
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}