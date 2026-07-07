'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const provincias = ['Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional','Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal','Independencia','La Altagracia','La Romana','La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná','San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís','Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde']

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
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setFotoPerfil(file); setPrevistaFoto(URL.createObjectURL(file)) }
  }

  const handleRegistro = async () => {
    if (!nombre || !email || !password || !provincia) { setError('Por favor completa todos los campos obligatorios'); return }
    setCargando(true)
    setError('')
    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) { setError(authError.message); setCargando(false); return }
    if (data.user) {
      let fotoUrl = null
      if (fotoPerfil) {
        const ext = fotoPerfil.name.split('.').pop()
        const fileName = `perfil_${data.user.id}_${Date.now()}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage.from('publicaciones').upload(fileName, fotoPerfil)
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage.from('publicaciones').getPublicUrl(fileName)
          fotoUrl = urlData.publicUrl
        }
      }
      const { error: perfilError } = await supabase.from('perfiles').upsert({ id: data.user.id, nombre, tipo, provincia, telefono, whatsapp: telefono, foto_perfil: fotoUrl })
      if (perfilError) { setError('Error al crear el perfil: ' + perfilError.message); setCargando(false); return }
      router.push('/')
    }
    setCargando(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Image src="/logo porcicultores rdv.jpeg" alt="Logo" width={70} height={70} style={{ objectFit: 'contain', borderRadius: '12px', marginBottom: '12px' }} />
          <h1 style={{ color: '#0a2463', fontSize: '20px', fontWeight: '900', marginBottom: '4px' }}>Crear Cuenta</h1>
        </div>
        <div style={{ display: 'flex', marginBottom: '24px', backgroundColor: '#f0f4f8', borderRadius: '12px', padding: '4px' }}>
          <Link href="/login" style={{ flex: 1, textAlign: 'center', padding: '10px', color: '#64748b', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>Iniciar Sesion</Link>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '10px', color: '#0a2463', fontWeight: '700', fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>Registrarse</div>
        </div>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '13px' }}>Foto de perfil (opcional)</label>
        <div onClick={() => document.getElementById('inputFotoReg')?.click()}
          style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px dashed #cbd5e1', margin: '0 auto 20px', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
          {previstaFoto ? <img src={previstaFoto} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#94a3b8', fontSize: '28px' }}>+</span>}
        </div>
        <input id="inputFotoReg" type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px' }}>Tipo de usuario</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          {[
            { valor: 'comprador', label: 'Comprador' },
            { valor: 'vendedor', label: 'Vendedor' },
            { valor: 'consumidor', label: 'Consumidor' },
            { valor: 'transportista', label: 'Transportista' },
          ].map(t => (
            <div key={t.valor} onClick={() => setTipo(t.valor)}
              style={{ padding: '12px', borderRadius: '10px', border: `2px solid ${tipo === t.valor ? '#0a2463' : '#e2e8f0'}`, cursor: 'pointer', backgroundColor: tipo === t.valor ? '#f0f4ff' : 'white', textAlign: 'center', fontWeight: '700', fontSize: '13px', color: '#0a2463' }}>
              {t.label}
            </div>
          ))}
        </div>
        <input type="text" placeholder="Nombre completo *" value={nombre} onChange={(e) => setNombre(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
        <input type="email" placeholder="Correo electronico *" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Contrasena *" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
        <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}>
          <option value="">Selecciona tu provincia *</option>
          {provincias.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="tel" placeholder="Telefono / WhatsApp" value={telefono} onChange={(e) => setTelefono(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
        {error && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>{error}</div>}
        <button onClick={handleRegistro} disabled={cargando}
          style={{ width: '100%', padding: '14px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>
          {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>Al registrarte aceptas nuestros terminos de uso y politica de privacidad.</p>
      </div>
    </div>
  )
}