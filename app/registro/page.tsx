'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const provincias = [
  'Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional',
  'Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor',
  'Hermanas Mirabal','Independencia','La Altagracia','La Romana',
  'La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi',
  'Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná',
  'San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís',
  'Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde'
]

export default function Registro() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tiposSeleccionados, setTiposSeleccionados] = useState<string[]>(['comprador'])
  const [provincia, setProvincia] = useState('')
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const tiposDisponibles = [
    { valor: 'comprador', label: 'Comprador', desc: 'Busca y compra cerdos, lechones y suministros' },
    { valor: 'vendedor', label: 'Vendedor / Productor', desc: 'Publica tus animales y llega a mas clientes' },
    { valor: 'consumidor', label: 'Consumidor', desc: 'Consume productos del sector porcino' },
    { valor: 'transportista', label: 'Transportista', desc: 'Ofrece servicios de traslado de ganado' },
  ]

  const toggleTipo = (tipo: string) => {
    setTiposSeleccionados(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    )
  }

  const handleRegistro = async () => {
    if (!nombre || !email || !password || !provincia || tiposSeleccionados.length === 0) {
      setError('Por favor completa todos los campos obligatorios')
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
      const { error: perfilError } = await supabase.from('perfiles').insert({
        id: data.user.id,
        nombre,
        tipo: tiposSeleccionados[0],
        provincia,
        telefono,
        whatsapp: telefono,
      })
      if (perfilError) {
        setError('Error al crear el perfil')
      } else {
        router.push('/')
      }
    }
    setCargando(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Image src="/logo porcicultores rdv.jpeg" alt="Logo" width={70} height={70} style={{ objectFit: 'contain', borderRadius: '12px', marginBottom: '12px' }} />
          <h1 style={{ color: '#0a2463', fontSize: '20px', fontWeight: '900', marginBottom: '4px' }}>Crear Cuenta</h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Selecciona tu perfil para comenzar</p>
        </div>

        <div style={{ display: 'flex', marginBottom: '24px', backgroundColor: '#f0f4f8', borderRadius: '12px', padding: '4px' }}>
          <Link href="/login" style={{ flex: 1, textAlign: 'center', padding: '10px', color: '#64748b', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
            Iniciar Sesion
          </Link>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '10px', color: '#0a2463', fontWeight: '700', fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            Registrarse
          </div>
        </div>

        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '13px', color: '#374151' }}>Selecciona tu rol (puedes elegir varios)</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {tiposDisponibles.map((tipo) => (
            <div key={tipo.valor} onClick={() => toggleTipo(tipo.valor)}
              style={{ padding: '14px 16px', borderRadius: '12px', border: `2px solid ${tiposSeleccionados.includes(tipo.valor) ? '#0a2463' : '#e2e8f0'}`, cursor: 'pointer', backgroundColor: tiposSeleccionados.includes(tipo.valor) ? '#f0f4ff' : 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', color: '#0a2463', fontSize: '14px' }}>{tipo.label}</div>
                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>{tipo.desc}</div>
              </div>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${tiposSeleccionados.includes(tipo.valor) ? '#0a2463' : '#cbd5e1'}`, backgroundColor: tiposSeleccionados.includes(tipo.valor) ? '#0a2463' : 'white', flexShrink: 0 }} />
            </div>
          ))}
        </div>

        <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

        <input type="email" placeholder="Correo electronico" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

        <input type="password" placeholder="Contrasena" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

        <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}>
          <option value="">Selecciona tu provincia</option>
          {provincias.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <input type="tel" placeholder="Telefono / WhatsApp" value={telefono} onChange={(e) => setTelefono(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px', marginBottom: '16px', color: '#dc2626', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <button onClick={handleRegistro} disabled={cargando}
          style={{ width: '100%', padding: '14px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>
          {cargando ? 'Creando cuenta...' : 'Continuar Registro'}
        </button>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
          Al registrarte aceptas nuestros terminos de uso y politicas de privacidad para el sector agropecuario dominicano.
        </p>

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <Link href="/quienes-somos" style={{ color: '#0a2463', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>Plataforma Segura y Verificada</Link>
        </div>
      </div>
    </div>
  )
}