'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = ['Azua','Bahoruco','Barahona','Dajab\u00f3n','Distrito Nacional','Duarte','El\u00edas Pi\u00f1a','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal','Independencia','La Altagracia','La Romana','La Vega','Mar\u00eda Trinidad S\u00e1nchez','Monse\u00f1or Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata','Saman\u00e1','San Crist\u00f3bal','San Jos\u00e9 de Ocoa','San Juan','San Pedro de Macor\u00eds','S\u00e1nchez Ram\u00edrez','Santiago','Santiago Rodr\u00edguez','Santo Domingo','Valverde']
const tiposAnimales = ['cerdo','lechon','cerda','verraco','reproductor','engorde']

export default function Comprar() {
  const [tipo, setTipo] = useState('cerdo')
  const [cantidad, setCantidad] = useState('')
  const [provincia, setProvincia] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)

  const enviar = async () => {
    if (!provincia || !descripcion) return
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    await supabase.from('reportes').insert({
      motivo: 'Solicitud de compra: ' + tipo,
      descripcion: `Tipo: ${tipo} | Cantidad: ${cantidad} | Provincia: ${provincia} | Desc: ${descripcion}`,
      reportado_por: user.id
    })
    setEnviado(true)
    setCargando(false)
  }

  if (enviado) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px 24px', maxWidth: '420px', textAlign: 'center', border: '1px solid #E5E7EB', width: '100%' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>\u2705</div>
        <h2 style={{ color: '#1A3C5E', fontWeight: '700', margin: '0 0 10px 0' }}>Solicitud enviada</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>Los vendedores disponibles te contactar\u00e1n pronto por WhatsApp o mensajes.</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link href="/marketplace" style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Ver Marketplace</Link>
          <Link href="/" style={{ backgroundColor: '#F4F6F9', color: '#1A3C5E', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>Inicio</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F6F9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: '0 0 2px 0' }}>Necesito Comprar</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Publica lo que necesitas y los vendedores te contactar\u00e1n</p>
        </div>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>\u2190 Inicio</Link>
      </div>

      <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '14px', padding: '14px 16px', marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>\uD83D\uDCA1</span>
        <p style={{ color: '#374151', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>Describe lo que necesitas y los vendedores disponibles te contactar\u00e1n directamente.</p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #E5E7EB' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Tipo de animal que necesito</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {tiposAnimales.map(t => (
              <div key={t} onClick={() => setTipo(t)}
                style={{ padding: '10px 12px', borderRadius: '10px', border: `2px solid ${tipo === t ? '#2563A8' : '#E5E7EB'}`, cursor: 'pointer', backgroundColor: tipo === t ? '#EFF6FF' : 'white', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: tipo === t ? '#1D4ED8' : '#374151' }}>
                \uD83D\uDC37 {t.charAt(0).toUpperCase() + t.slice(1)}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Cantidad aproximada</label>
            <input type="number" placeholder="Ej: 10" value={cantidad} onChange={(e) => setCantidad(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#F9FAFB', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Provincia <span style={{ color: '#EF4444' }}>*</span></label>
            <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB' }}>
              <option value="">Selecciona...</option>
              {provincias.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Descripci\u00f3n de lo que necesitas <span style={{ color: '#EF4444' }}>*</span></label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe el peso, caracter\u00edsticas, presupuesto, etc..." rows={4}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB', boxSizing: 'border-box', resize: 'vertical', outline: 'none' }} />
        </div>

        <button onClick={enviar} disabled={cargando || !provincia || !descripcion}
          style={{ width: '100%', padding: '14px', background: cargando || !provincia || !descripcion ? '#E5E7EB' : 'linear-gradient(135deg, #1A3C5E, #2563A8)', color: cargando || !provincia || !descripcion ? '#9CA3AF' : 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
          {cargando ? '\u23F3 Enviando...' : '\uD83D\uDC37 Publicar Solicitud'}
        </button>
      </div>
    </div>
  )
}
