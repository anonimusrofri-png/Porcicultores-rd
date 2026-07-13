'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const provincias = ['Todas','Azua','Bahoruco','Barahona','Dajab\u00f3n','Distrito Nacional','Duarte','El\u00edas Pi\u00f1a','El Seibo','Espaillat','Hato Mayor','Hermanas Mirabal','Independencia','La Altagracia','La Romana','La Vega','Mar\u00eda Trinidad S\u00e1nchez','Monse\u00f1or Nouel','Monte Cristi','Monte Plata','Pedernales','Peravia','Puerto Plata','Saman\u00e1','San Crist\u00f3bal','San Jos\u00e9 de Ocoa','San Juan','San Pedro de Macor\u00eds','S\u00e1nchez Ram\u00edrez','Santiago','Santiago Rodr\u00edguez','Santo Domingo','Valverde']

export default function Transportistas() {
  const [transportistas, setTransportistas] = useState<any[]>([])
  const [provincia, setProvincia] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [form, setForm] = useState({ nombre: '', provincia: '', telefono: '', whatsapp: '', descripcion: '', capacidad: '', experiencia: '' })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  useEffect(() => { cargarDatos() }, [provincia])

  const cargarDatos = async () => {
    setCargando(true)
    let query = supabase.from('perfiles').select('*').eq('tipo', 'transportista')
    if (provincia !== 'Todas') query = query.eq('provincia', provincia)
    const { data } = await query.order('estrellas', { ascending: false })
    setTransportistas(data || [])
    setCargando(false)
  }

  const filtrados = transportistas.filter(t =>
    busqueda === '' ||
    t.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.provincia?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const enviarSolicitud = async () => {
    if (!form.nombre || !form.provincia || !form.whatsapp) return
    setEnviando(true)
    await supabase.from('reportes').insert({
      motivo: 'Solicitud transportista: ' + form.nombre,
      descripcion: `Provincia: ${form.provincia} | WA: ${form.whatsapp} | Capacidad: ${form.capacidad} | Exp: ${form.experiencia} | Desc: ${form.descripcion}`,
    })
    setEnviado(true)
    setEnviando(false)
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F6F9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1A3C5E', fontSize: '20px', fontWeight: '700', margin: '0 0 2px 0' }}>Transportistas</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Transporte especializado de ganado porcino</p>
        </div>
        <Link href="/" style={{ color: '#2563A8', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>\u2190 Inicio</Link>
      </div>

      <input placeholder="\uD83D\uDD0D Buscar por nombre o provincia..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: 'white', boxSizing: 'border-box', marginBottom: '12px', outline: 'none' }} />

      <select value={provincia} onChange={(e) => setProvincia(e.target.value)}
        style={{ width: '100%', padding: '11px 14px', marginBottom: '16px', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: 'white', boxSizing: 'border-box' }}>
        {provincias.map(p => <option key={p} value={p}>{p}</option>)}
      </select>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', borderLeft: '4px solid #3B82F6' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>\uD83D\uDEE1\uFE0F</span>
          <p style={{ color: '#374151', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>Transportistas con protocolos de bioseguridad para el manejo seguro de porcinos en Rep\u00fablica Dominicana.</p>
        </div>
      </div>

      {cargando ? (
        <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>Cargando transportistas...</p>
      ) : filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>\uD83D\uDE9B</div>
          <p style={{ color: '#9CA3AF', fontWeight: '600', fontSize: '14px' }}>No hay transportistas en esta provincia</p>
          <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '8px' }}>\u00BFEres transportista? Usa el bot\u00f3n de abajo.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '80px' }}>
          {filtrados.map((t) => (
            <div key={t.id} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '10px', backgroundColor: '#1A3C5E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '20px', overflow: 'hidden', flexShrink: 0 }}>
                  {t.foto_perfil ? <img src={t.foto_perfil} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : t.nombre?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontWeight: '700', color: '#111827', margin: '0 0 2px 0', fontSize: '15px' }}>{t.nombre}</p>
                    {t.verificado && <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>\u2705 Verificado</span>}
                  </div>
                  <p style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 6px 0' }}>\uD83D\uDCCD {t.provincia}</p>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= Math.round(t.estrellas || 0) ? '#F59E0B' : '#E5E7EB', fontSize: '14px' }}>\u2605</span>)}
                    <span style={{ color: '#6B7280', fontSize: '12px', marginLeft: '4px' }}>({t.estrellas || 0})</span>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px', marginBottom: '12px' }}>
                {t.descripcion && <p style={{ color: '#374151', fontSize: '13px', margin: '0 0 6px 0', lineHeight: 1.5 }}>\uD83D\uDE9B {t.descripcion}</p>}
                <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>\uD83D\uDD04 Transportista registrado en Porcicultores RD</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link href={"/chat?usuario=" + t.id} style={{ backgroundColor: 'white', color: '#374151', border: '1px solid #E5E7EB', padding: '10px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                  \uD83D\uDCAC Chat Privado
                </Link>
                {t.whatsapp && (
                  <a href={"https://wa.me/1" + t.whatsapp.replace(/\D/g,'')} target="_blank"
                    style={{ backgroundColor: '#1A3C5E', color: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setMostrarModal(true)}
        style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#1A3C5E', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '24px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 20px rgba(26,60,94,0.4)', zIndex: 50 }}>
        \uD83D\uDE9B + Ser Transportista
      </button>

      {mostrarModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) setMostrarModal(false) }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px 20px 0 0', padding: '24px', width: '100%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto' }}>
            {enviado ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>\u2705</div>
                <h3 style={{ color: '#1A3C5E', fontWeight: '700', margin: '0 0 8px 0' }}>\u00A1Solicitud enviada!</h3>
                <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 20px 0' }}>El administrador revisar\u00e1 tu solicitud y te contactar\u00e1 pronto.</p>
                <button onClick={() => { setMostrarModal(false); setEnviado(false); setForm({ nombre: '', provincia: '', telefono: '', whatsapp: '', descripcion: '', capacidad: '', experiencia: '' }) }}
                  style={{ backgroundColor: '#1A3C5E', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ color: '#1A3C5E', fontWeight: '700', fontSize: '18px', margin: 0 }}>\uD83D\uDE9B Ser Transportista</h3>
                  <button onClick={() => setMostrarModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B7280' }}>\u2715</button>
                </div>
                <p style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 16px 0' }}>Completa el formulario y el administrador verificar\u00e1 tu perfil.</p>
                {[
                  { label: 'Nombre completo *', key: 'nombre', type: 'text', placeholder: 'Tu nombre o empresa' },
                  { label: 'Tel\u00e9fono', key: 'telefono', type: 'tel', placeholder: '809-000-0000' },
                  { label: 'WhatsApp *', key: 'whatsapp', type: 'tel', placeholder: '809-000-0000' },
                  { label: 'Capacidad', key: 'capacidad', type: 'text', placeholder: 'Ej: Hasta 50 cerdos' },
                  { label: 'A\u00f1os de experiencia', key: 'experiencia', type: 'text', placeholder: 'Ej: 10 a\u00f1os' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB', boxSizing: 'border-box', outline: 'none' }} />
                  </div>
                ))}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Provincia *</label>
                  <select value={form.provincia} onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB' }}>
                    <option value="">Selecciona tu provincia</option>
                    {provincias.filter(p => p !== 'Todas').map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Descripci\u00f3n del servicio</label>
                  <textarea placeholder="Describe tu servicio, tipo de cami\u00f3n, rutas, etc." value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', backgroundColor: '#F9FAFB', boxSizing: 'border-box', resize: 'vertical', outline: 'none' }} />
                </div>
                <button onClick={enviarSolicitud} disabled={enviando || !form.nombre || !form.provincia || !form.whatsapp}
                  style={{ width: '100%', padding: '14px', background: enviando ? '#93C5FD' : 'linear-gradient(135deg, #1A3C5E, #2563A8)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                  {enviando ? '\u23F3 Enviando...' : '\u2713 Enviar Solicitud'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
