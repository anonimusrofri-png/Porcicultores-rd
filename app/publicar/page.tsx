'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = [
  'Azua', 'Bahoruco', 'Barahona', 'Dajabón', 'Distrito Nacional', 'Duarte', 'Elías Piña', 
  'El Seibo', 'Espaillat', 'Hato Mayor', 'Hermanas Mirabal', 'Independencia', 'La Altagracia', 
  'La Romana', 'La Vega', 'María Trinidad Sánchez', 'Monseñor Nouel', 'Monte Cristi', 
  'Monte Plata', 'Pedernales', 'Peravia', 'Puerto Plata', 'Samaná', 'San Cristóbal', 
  'San José de Ocoa', 'San Juan', 'San Pedro de Macorís', 'Sánchez Ramírez', 'Santiago', 
  'Santiago Rodríguez', 'Santo Domingo', 'Valverde'
]

const tiposAnimales = [
  { valor: 'cerdo', label: '🐷 Cerdo', desc: 'Cerdo en general' },
  { valor: 'lechon', label: '🐷 Lechón', desc: 'Menos de 3 meses' },
  { valor: 'cerda', label: '🐷 Cerda', desc: 'Hembra adulta' },
  { valor: 'verraco', label: '🐷 Barraco', desc: 'Macho reproductor' },
  { valor: 'reproductor', label: '🐷 Reproductor', desc: 'Para cría' },
  { valor: 'engorde', label: '🐷 Engorde', desc: 'Listo para mercado' },
]

export default function Publicar() {
  const [tipoAnimal, setTipoAnimal] = useState('cerdo')
  const [precio, setPrecio] = useState('')
  const [peso, setPeso] = useState('')
  const [provincia, setProvincia] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [previstaImagen, setPrevistaImagen] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { 
      setImagen(file)
      setPrevistaImagen(URL.createObjectURL(file)) 
    }
  }

  const handlePublicar = async () => {
    if (!precio || !provincia || !descripcion) { 
      setError('Por favor completa todos los campos obligatorios (*)')
      return 
    }
    if (!imagen) { 
      setError('Debes agregar una foto del animal')
      return 
    }

    setCargando(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { 
      setError('Debes iniciar sesión para publicar')
      setCargando(false)
      return 
    }

    const ext = imagen.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${ext}`
    const { data: uploadData, error: uploadError } = await supabase.storage.from('publicaciones').upload(fileName, imagen)

    let fotoUrl = null
    if (!uploadError && uploadData) {
      const { data: urlData } = supabase.storage.from('publicaciones').getPublicUrl(fileName)
      fotoUrl = urlData.publicUrl
    }

    const { error: insertError } = await supabase.from('publicaciones').insert({
      usuario_id: user.id,
      tipo_animal: tipoAnimal,
      precio: parseFloat(precio),
      peso: peso ? parseFloat(peso) : null,
      provincia,
      descripcion,
      foto_url: fotoUrl,
      activo: false,
      estado: 'pendiente',
    })

    if (insertError) { 
      setError('Error al publicar. Intenta de nuevo.') 
    } else { 
      setEnviado(true) 
    }
    setCargando(false)
  }

  // Pantalla de Confirmación tras enviar
  if (enviado) return (
    <div style={{ maxWidth: '440px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ backgroundColor: '#F8FAFC', borderRadius: '24px', padding: '36px 24px', textAlign: 'center', border: '1px solid #E2E8F0', width: '100%' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>
          ✓
        </div>
        <h2 style={{ color: '#1E293B', fontWeight: '700', margin: '0 0 8px 0', fontSize: '22px' }}>Publicación enviada</h2>
        <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '6px', lineHeight: 1.5 }}>
          Tu publicación fue enviada exitosamente para revisión.
        </p>
        <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '28px' }}>
          El equipo administrador la revisará en 24-48 horas.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link href="/perfil" style={{ backgroundColor: '#0253A3', color: 'white', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
            Ver mis publicaciones
          </Link>
          <Link href="/" style={{ backgroundColor: '#FFFFFF', color: '#64748B', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', padding: '20px 16px', fontFamily: "'Inter', sans-serif", backgroundColor: '#FFFFFF', minHeight: '100vh', boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>

      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1E293B', fontSize: '22px', fontWeight: '700', margin: '0 0 2px 0' }}>Nueva Publicación</h1>
          <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>Publica tus animales en el marketplace</p>
        </div>
        <Link href="/" style={{ color: '#0253A3', textDecoration: 'none', fontSize: '13px', fontWeight: '600', backgroundColor: '#EFF6FF', padding: '6px 12px', borderRadius: '20px' }}>
          ← Inicio
        </Link>
      </div>

      {/* Aviso de revisión */}
      <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '14px', padding: '12px 14px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '18px' }}>⏳</span>
        <p style={{ color: '#92400E', fontSize: '12px', margin: 0, lineHeight: 1.4, fontWeight: '500' }}>
          Las publicaciones son revisadas por el administrador antes de ser visibles (24 a 48 horas).
        </p>
      </div>

      {/* Cargar Foto */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px', marginBottom: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '10px' }}>
          Foto del animal <span style={{ color: '#EF4444' }}>*</span>
        </p>
        <div onClick={() => document.getElementById('inputImagen')?.click()}
          style={{ width: '100%', height: '190px', borderRadius: '12px', border: previstaImagen ? '2px solid #10B981' : '2px dashed #BFDBFE', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: previstaImagen ? '#F0FDF4' : '#F8FAFC', transition: 'all 0.2s' }}>
          {previstaImagen ? (
            <img src={previstaImagen} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', color: '#0253A3' }}>
              <div style={{ fontSize: '36px', marginBottom: '6px' }}>📷</div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>Toca para agregar foto</div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>JPG o PNG hasta 5MB</div>
            </div>
          )}
        </div>
        {previstaImagen && <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', marginTop: '8px', marginBottom: 0 }}>✓ Foto seleccionada</p>}
        <input id="inputImagen" type="file" accept="image/*" onChange={handleImagen} style={{ display: 'none' }} />
      </div>

      {/* Tipo de Animal */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px', marginBottom: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '12px' }}>
          Tipo de animal <span style={{ color: '#EF4444' }}>*</span>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {tiposAnimales.map(t => (
            <div key={t.valor} onClick={() => setTipoAnimal(t.valor)}
              style={{ padding: '12px', borderRadius: '12px', border: `2px solid ${tipoAnimal === t.valor ? '#0253A3' : '#E2E8F0'}`, cursor: 'pointer', backgroundColor: tipoAnimal === t.valor ? '#EFF6FF' : '#FFFFFF', transition: 'all 0.15s ease' }}>
              <div style={{ fontWeight: '700', fontSize: '13px', color: '#1E293B', marginBottom: '2px' }}>{t.label}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detalles del Anuncio */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '14px' }}>Detalles de la publicación</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Precio RD$ <span style={{ color: '#EF4444' }}>*</span></label>
            <input type="number" placeholder="Ej: 15000" value={precio} onChange={(e) => setPrecio(e.target.value)}
              style={{ width: '100%', padding: '11px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#F8FAFC', outline: 'none', color: '#1E293B' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Peso en lbs</label>
            <input type="number" placeholder="Ej: 150" value={peso} onChange={(e) => setPeso(e.target.value)}
              style={{ width: '100%', padding: '11px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#F8FAFC', outline: 'none', color: '#1E293B' }} />
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Provincia <span style={{ color: '#EF4444' }}>*</span></label>
          <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
            style={{ width: '100%', padding: '11px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', backgroundColor: '#F8FAFC', boxSizing: 'border-box', color: '#1E293B', outline: 'none' }}>
            <option value="">Selecciona una provincia</option>
            {provincias.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Descripción <span style={{ color: '#EF4444' }}>*</span></label>
          <textarea placeholder="Describe el animal: alimentación, vacunas, características..." value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)} rows={4}
            style={{ width: '100%', padding: '11px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', outline: 'none', backgroundColor: '#F8FAFC', lineHeight: 1.5, color: '#1E293B' }} />
        </div>
      </div>

      {/* Errores si existen */}
      {error && (
        <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px', color: '#DC2626', fontSize: '13px', fontWeight: '500' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Botón Guardar / Publicar */}
      <button onClick={handlePublicar} disabled={cargando}
        style={{ width: '100%', padding: '14px', backgroundColor: cargando ? '#94A3B8' : '#0253A3', color: 'white', border: 'none', borderRadius: '12px', cursor: cargando ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: '700', marginBottom: '16px', boxShadow: '0 4px 12px rgba(2, 83, 163, 0.2)' }}>
        {cargando ? '⏳ Enviando...' : '🐷 Enviar para Revisión'}
      </button>

      {/* Descargo de responsabilidad */}
      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
        <p style={{ color: '#64748B', fontSize: '11px', margin: 0, lineHeight: 1.5 }}>
          ℹ️ Al publicar aceptas que Porcicultores RD no se hace responsable de las transacciones ni acuerdos realizados entre usuarios.
        </p>
      </div>

    </div>
  )
}