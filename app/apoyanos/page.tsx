'use client';

import React from 'react';

export default function ApoyanosPage() {
  const numeroTelefono = "18293982463";
  const mensajeWhatsApp = encodeURIComponent("¡Hola! Me gustaría ponerme en contacto con el equipo de Porcicultores RD para apoyar el proyecto.");
  const linkWhatsApp = `https://wa.me/${numeroTelefono}?text=${mensajeWhatsApp}`;
  const linkPayPal = "https://www.paypal.com/paypalme/tuusuario";

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
            Apóyanos a seguir creciendo
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', maxWidth: '36rem', margin: '0 auto' }}>
            Tu apoyo ayuda a mantener <strong>Porcicultores RD</strong> como una herramienta gratuita y accesible para todos los productores porcinos de la República Dominicana.
          </p>
        </div>

        {/* Tarjetas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          
          {/* WhatsApp */}
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                Contactar por WhatsApp 💬
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                Comunícate directamente con nosotros al +1 (829) 398-2463 para coordinar tu apoyo o colaboración.
              </p>
            </div>
            <span style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#059669', fontWeight: 600 }}>
              Escribir ahora →
            </span>
          </a>

          {/* PayPal */}
          <a
            href={linkPayPal}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                Donar con PayPal 💳
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                Realiza un aporte rápido y seguro desde cualquier lugar a través de PayPal o tarjeta.
              </p>
            </div>
            <span style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#2563eb', fontWeight: 600 }}>
              Ir a PayPal →
            </span>
          </a>

        </div>

        {/* Nota Instagram */}
        <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '0.75rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
          📷 Próximamente estaremos habilitando nuestra cuenta oficial de Instagram. ¡Mantente atento!
        </div>

      </div>
    </main>
  );
}