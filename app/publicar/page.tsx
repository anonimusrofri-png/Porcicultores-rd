'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = ['Azua','Bahoruco','Barahona','Dajab\u00f3n','Distrito Nacional','Duarte','El\u00edas Pi\u00f1a','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal','Independencia','La Altagracia','La Romana','La Vega','Mar\u00eda Trinidad S\u00e1nchez','Monse\u00f1or Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata','Saman\u00e1','San Crist\u00f3bal','San Jos\u00e9 de Ocoa','San Juan','San Pedro de Macor\u00eds','S\u00e1nchez Ram\u00edrez','Santiago','Santiago Rodr\u00edguez','Santo Domingo','Valverde']

const tiposAnimales = [
  { valor: 'cerdo', label: '\uD83D\uDC37 Cerdo', desc: 'Cerdo en general' },
  { valor: 'lechon', label: '\uD83D\uDC37 Lech\u00f3n', desc: 'Menos de 3 meses' },
  { valor: 'cerda', label: '\uD83D\uDC37 Cerda', desc: 'Hembra adulta' },
  { valor: 'verraco', label: '\uD83D\uDC37 Barraco', desc: 'Macho reproductor' },
  { valor: 'reproductor', label: '\uD83D\uDC37 Reproductor', desc: 'Para cr\u00eda' },
  { valor: 'engorde', label: '\uD83D\uDC37 Engorde', desc: 'Listo para mercado' },
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
    if (file) { setImagen(file); setPrevistaImagen(URL.createObjectURL(file)) }
  }

  const handlePublicar = async () => {
    if (!precio || !provincia || !descripcion) { setError('Por favor completa todos los campos obligatorios'); return }
    if (!imagen) { setError('Debes agregar una foto del animal'); return }
    setCargando(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Debes iniciar sesi\u00f3n para publicar'); setCargando(false); return }
    const ext = imagen.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${ext}`
    const { data: uploadData, error: uploadError } = await supabase.storage.from('publicaciones').upload(fileName, imagen)
    let fotoUrl = null
    if (!uploadError && uploadData) {
      const { data: urlData } = supabase.storage.from('publicaciones').getPublicUrl(fileName)
      fotoUrl = urlData.publicUrl
    }
    const { error: insertError } = await supabase.from('publicaciones').insert({
      usuario_id: user.id, tipo_animal: tipoAnimal, precio: parseFloat(precio),
      peso: peso ? parseFloat(peso) : null, provincia, descripcion, foto_url: fotoUrl, activo: false, estado: 'pendiente',
    })
    if (insertError) { setError('Error al publicar. Intenta de nuevo.') } else { setEnviado(true) }
    setCargando(false)
  }

  if (enviado) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px 24px', maxWidth: '420px', textAlign: 'center', border: '1px solid #E5E7EB', width: '100%' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>\u2705</div>
        <h2 style={{ color: '#1A3C5E', fontWeight: '700', margin: '0 0 10px 0', fontSize: '20px' }}>Publicaci\u00f3n enviada</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px', lineHeight: 1.6 }}>Tu publicaci\u00f3n fue enviada para revisi\u00f3n.</p>
        <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>El administrador la revisar\u00e1 en 24-48 horas.</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link href="/perfil" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Ver mis publicaciones</Link>
          <Link href="/" style={{ backgroundColor: '#F4F6F9', color: '#1A3C5E', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>Inicio</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F6F9', minHeight: '100vh' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: '0 0 2px 0' }}>Nueva Publicaci\u00f3n</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Publica tus animales en el marketplace</p>
        </div>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>\u2190 Inicio</Link>
      </div>

      <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '16px' }}>\u23F3</span>
        <p style={{ color: '#92400E', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>Toda publicaci\u00f3n ser\u00e1 revisada por el administrador antes de ser visible. Proceso: 24 a 48 horas.</p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '10px' }}>Foto del animal <span style={{ color: '#EF4444' }}>*</span></p>
        <div onClick={() => document.getElementById('inputImagen')?.click()}
          style={{ width: '100%', height: '200px', borderRadius: '12px', border: previstaImagen ? '2px solid #10B981' : '2px dashed #BFDBFE', marginBottom: '4px', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: previstaImagen ? '#F0FDF4' : '#EFF6FF' }}>
          {previstaImagen ? (
            <img src={previstaImagen} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', color: '#3B82F6' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>\uD83D\uDCF7</div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>Toca para agregar foto</div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>JPG, PNG hasta 5MB</div>
            </div>
          )}
        </div>
        {previstaImagen && <p style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', margin: 0 }}>\u2705 Foto cargada</p>}
        <input id="inputImagen" type="file" accept="image/*" onChange={handleImagen} style={{ display: 'none' }} />
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>Tipo de animal <span style={{ color: '#EF4444' }}>*</span></p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {tiposAnimales.map(t => (
            <div key={t.valor} onClick={() => setTipoAnimal(t.valor)}
              style={{ padding: '12px', borderRadius: '10px', border: `2px solid ${tipoAnimal === t.valor ? '#2563A8' : '#E5E7EB'}`, cursor: 'pointer', backgroundColor: tipoAnimal === t.valor ? '#EFF6FF' : 'white', transition: 'all 0.2s' }}>
              <div style={{ fontWeight: '700', fontSize: '13px', color: '#111827', marginBottom: '2px' }}>{t.label}</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '14px' }}>Detalles de la publicaci\u00f3n</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Precio RD$ <span style={{ color: '#EF4444' }}>*</span></label>
            <input type="number" placeholder="Ej: 15000" value={precio} onChange={(e) => setPrecio(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#F9FAFB', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Peso en lbs</label>
            <input type="number" placeholder="Ej: 150" value={peso} onChange={(e) => setPeso(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#F9FAFB', outline: 'none' }} />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Provincia <span style={{ color: '#EF4444' }}>*</span></label>
          <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', backgroundColor: '#F9FAFB', boxSizing: 'border-box' }}>
            <option value="">Selecciona una provincia</option>
            {provincias.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Descripci\u00f3n <span style={{ color: '#EF4444' }}>*</span></label>
          <textarea placeholder="Describe el animal: alimentaci\u00f3n, vacunas, caracter\u00edsticas..." value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)} rows={4}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', outline: 'none', backgroundColor: '#F9FAFB', lineHeight: 1.6 }} />
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>
          \u26A0\uFE0F {error}
        </div>
      )}

      <button onClick={handlePublicar} disabled={cargando}
        style={{ width: '100%', padding: '14px', background: cargando ? '#93C5FD' : 'linear-gradient(135deg, #1A3C5E, #2563A8)', color: 'white', border: 'none', borderRadius: '12px', cursor: cargando ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: '700', marginBottom: '12px' }}>
        {cargando ? '\u23F3 Enviando...' : '\uD83D\uDC37 Enviar para Revisi\u00f3n'}
      </button>

      <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
        <p style={{ color: '#374151', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
          \u2139\uFE0F Al publicar aceptas que Porcicultores RD no se hace responsable de las transacciones realizadas entre usuarios.
        </p>
      </div>
    </div>
  )
}
