'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const provincias = ['Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional','Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal','Independencia','La Altagracia','La Romana','La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná','San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís','Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde']

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
    if (file) { setFotoPerfil(file); setPrevistaFoto(URL.createObjectURL(file)) }
  }

  const handleRegistro = async () => {
    if (!nombre || !email || !password || !provincia) {
      setError('Por favor completa todos los campos obligatorios'); return
    }
    if (!fotoPerfil) {
      setError('La foto de perfil es obligatoria'); return
    }
    if (tipo === 'admin' && claveAdmin !== CLAVE_ADMIN) {
      setError('Clave de acceso incorrecta'); return
    }
    setCargando(true)
    setError('')
    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) { setError(authError.message); setCargando(false); return }
    if (data.user) {
      let fotoUrl = null
      const ext = fotoPerfil.name.split('.').pop()
      const fileName = `perfil_${data.user.id}_${Date.now()}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('publicaciones').upload(fileName, fotoPerfil)
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('publicaciones').getPublicUrl(fileName)
        fotoUrl = urlData.publicUrl
      }
      const { error: perfilError } = await supabase.from('perfiles').upsert({
        id: data.user.id, nombre, tipo: tipo === 'admin' ? 'admin' : tipo,
        provincia, telefono, whatsapp: telefono, foto_perfil: fotoUrl, es_admin: tipo === 'admin'
      })
      if (perfilError) { setError('Error al crear el perfil: ' + perfilError.message); setCargando(false); return }
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
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" }}>

      <div style={{ width: '100%', maxWidth: '480px', background: 'linear-gradient(135deg, #1A3C5E 0%, #2563A8 100%)', borderRadius: '20px 20px 0 0', padding: '32px 24px', textAlign: 'center' }}>
        <Image src="/logo porcicultores rdv.jpeg" alt="Logo" width={64} height={64} style={{ objectFit: 'contain', borderRadius: '12px', marginBottom: '12px' }} />
        <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>Crear Cuenta</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Únete al sector porcino dominicano</p>
      </div>

      <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '480px', borderRadius: '0 0 20px 20px', padding: '28px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>

        <div style={{ display: 'flex', backgroundColor: '#F4F6F9', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
          <Link href="/login" style={{ flex: 1, textAlign: 'center', padding: '10px', color: '#6B7280', fontWeight: '600', fontSize: '14px', textDecoration: 'none', borderRadius: '10px' }}>
            Iniciar Sesión
          </Link>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#1A3C5E', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '14px' }}>
            Registrarse
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
            Foto de perfil <span style={{ color: '#EF4444' }}>*</span>
          </p>
          <p style={{ fontSize: '11px', color: '#6B7280', marginBottom: '10px' }}>Obligatoria para verificación</p>
          <div onClick={() => document.getElementById('inputFotoReg')?.click()}
            style={{ width: '88px', height: '88px', borderRadius: '50%', border: `2px dashed ${fotoPerfil ? '#10B981' : '#BFDBFE'}`, margin: '0 auto', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: fotoPerfil ? '#D1FAE5' : '#EFF6FF' }}>
            {previstaFoto
              ? <img src={previstaFoto} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px' }}>📷</div>
                  <div style={{ fontSize: '10px', color: '#3B82F6', fontWeight: '600' }}>Subir foto</div>
                </div>
            }
          </div>
          {fotoPerfil && <p style={{ fontSize: '11px', color: '#10B981', marginTop: '6px', fontWeight: '600' }}>✅ Foto cargada</p>}
          <input id="inputFotoReg" type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
        </div>

        <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '10px' }}>Tipo de usuario</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          {tiposUsuario.map(t => (
            <div key={t.valor} onClick={() => { setTipo(t.valor); setClaveAdmin('') }}
              style={{
                padding: '12px', borderRadius: '10px',
                border: `2px solid ${tipo === t.valor ? (t.valor === 'admin' ? '#1B5E20' : '#2563A8') : '#E5E7EB'}`,
                cursor: 'pointer',
                backgroundColor: tipo === t.valor ? (t.valor === 'admin' ? '#F0FDF4' : '#EFF6FF') : 'white',
                transition: 'all 0.2s',
                gridColumn: t.valor === 'admin' ? '1 / -1' : 'auto'
              }}>
              <div style={{ fontWeight: '700', fontSize: '13px', color: '#111827', marginBottom: '2px' }}>{t.label}</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>{t.desc}</div>
            </div>
          ))}
        </div>

        {tipo === 'admin' && (
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#1B5E20', marginBottom: '8px' }}>🔐 Acceso restringido</p>
            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>Ingresa la clave de autorización para continuar</p>
            <input type="password" placeholder="Clave de autorización" value={claveAdmin}
              onChange={(e) => setClaveAdmin(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${claveAdmin && claveAdmin !== CLAVE_ADMIN ? '#EF4444' : '#E5E7EB'}`, fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box', outline: 'none' }} />
            {claveAdmin && claveAdmin === CLAVE_ADMIN && <p style={{ fontSize: '12px', color: '#10B981', marginTop: '6px', fontWeight: '600' }}>✅ Clave correcta</p>}
            {claveAdmin && claveAdmin !== CLAVE_ADMIN && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '6px' }}>❌ Clave incorrecta</p>}
          </div>
        )}

        {[
          { placeholder: 'Nombre completo *', value: nombre, onChange: setNombre, type: 'text' },
          { placeholder: 'Correo electrónico *', value: email, onChange: setEmail, type: 'email' },
          { placeholder: 'Contraseña *', value: password, onChange: setPassword, type: 'password' },
          { placeholder: 'Teléfono / WhatsApp', value: telefono, onChange: setTelefono, type: 'tel' },
        ].map((campo) => (
          <input key={campo.placeholder} type={campo.type} placeholder={campo.placeholder} value={campo.value}
            onChange={(e) => campo.onChange(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', backgroundColor: '#F9FAFB', boxSizing: 'border-box', outline: 'none', color: '#111827' }} />
        ))}

        <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', backgroundColor: '#F9FAFB', boxSizing: 'border-box', color: provincia ? '#111827' : '#9CA3AF' }}>
          <option value="">Selecciona tu provincia *</option>
          {provincias.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={handleRegistro} disabled={cargando}
          style={{ width: '100%', padding: '14px', background: cargando ? '#93C5FD' : 'linear-gradient(135deg, #1A3C5E, #2563A8)', color: 'white', border: 'none', borderRadius: '10px', cursor: cargando ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>
          {cargando ? '⏳ Creando cuenta...' : 'Crear Cuenta'}
        </button>

        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '12px 16px' }}>
          <p style={{ color: '#6B7280', fontSize: '12px', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
            ℹ️ Al registrarte aceptas nuestros <Link href="/terminos" style={{ color: '#2563A8', fontWeight: '600' }}>términos de uso</Link> y <Link href="/terminos/privacidad" style={{ color: '#2563A8', fontWeight: '600' }}>política de privacidad</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}