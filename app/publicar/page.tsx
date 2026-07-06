'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = [
  'Azua','Bahoruco','Barahona','Dajabón','Distrito Nacional',
  'Duarte','Elías Piña','El Seibo','Espaillat','Hato Mayor',
  'Hermanas Mirabal','Independencia','La Altagracia','La Romana',
  'La Vega','María Trinidad Sánchez','Monseñor Nouel','Monte Cristi',
  'Monte Plata','Pedernales','Peravia','Puerto Plata','Samaná',
  'San Cristóbal','San José de Ocoa','San Juan','San Pedro de Macorís',
  'Sánchez Ramírez','Santiago','Santiago Rodríguez','Santo Domingo','Valverde'
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
      setError('Por favor completa todos los campos obligatorios')
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
      setError('Debes iniciar sesion para publicar')
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
    const { error } = await supabase.from('publicaciones').insert({
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
    if (error) {
      setError('Error al publicar. Intenta de nuevo.')
    } else {
      setEnviado(true)
    }
    setCargando(false)
  }

  if (enviado) return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', border: '1px solid #ddd', borderRadius: '16px', backgroundColor: 'white' }}>
      <h2 style={{ color: '#16a34a', marginBottom: '12px' }}>Publicacion enviada</h2>
      <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>Tu publicacion ha sido enviada para revision. El proceso puede tardar entre 24 y 48 horas, aunque podria aprobarse antes.</p>
      <Link href="/" style={{ backgroundColor: '#0a2463', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' }}>Volver al inicio</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: '560px', margin: '40px auto', padding: '40px', fontFamily: 'sans-serif', border: '1px solid #e2e8f0', borderRadius: '16px', backgroundColor: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ color: '#0a2463', fontSize: '22px', fontWeight: '800' }}>Nueva Publicacion</h1>
        <Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>Volver</Link>
      </div>
      <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fcd34d', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: '#92400e' }}>
        Toda publicacion sera revisada por el administrador antes de ser visible. Proceso: 24 a 48 horas.
      </div>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Foto del animal (obligatoria)</label>
      <div onClick={() => document.getElementById('inputImagen')?.click()}
        style={{ width: '100%', height: '200px', borderRadius: '12px', border: '2px dashed #cbd5e1', marginBottom: '20px', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        {previstaImagen ? (
          <img src={previstaImagen} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>+</div>
            <div style={{ fontSize: '14px' }}>Toca para agregar foto</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>JPG, PNG hasta 5MB</div>
          </div>
        )}
      </div>
      <input id="inputImagen" type="file" accept="image/*" onChange={handleImagen} style={{ display: 'none' }} />
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Tipo de animal</label>
      <select value={tipoAnimal} onChange={(e) => setTipoAnimal(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white' }}>
        <option value="cerdo">Cerdo</option>
        <option value="lechon">Lechon</option>
        <option value="cerda">Cerda</option>
        <option value="verraco">Barraco</option>
        <option value="reproductor">Reproductor</option>
        <option value="engorde">Engorde</option>
      </select>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Precio en RD$</label>
      <input type="number" placeholder="Ej: 15000" value={precio} onChange={(e) => setPrecio(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Peso en lbs</label>
      <input type="number" placeholder="Ej: 150" value={peso} onChange={(e) => setPeso(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }} />
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Provincia</label>
      <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: 'white' }}>
        <option value="">Selecciona una provincia</option>
        {provincias.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '14px' }}>Descripcion</label>
      <textarea placeholder="Describe lo que vendes..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
        rows={4} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
      {error && <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '14px', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px' }}>{error}</p>}
      <button onClick={handlePublicar} disabled={cargando}
        style={{ width: '100%', padding: '14px', backgroundColor: '#0a2463', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>
        {cargando ? 'Enviando...' : 'Enviar para Revision'}
      </button>
    </div>
  )
}