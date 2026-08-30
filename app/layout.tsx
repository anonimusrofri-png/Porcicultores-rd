import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Porcicultores RD - Marketplace y Directorio Porcino',
  description: 'Plataforma para la compra, venta y directorio de negocios de la porcicultura en República Dominicana.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, backgroundColor: '#F8FAFC', color: '#1E293B' }}>
        {children}
      </body>
    </html>
  )
}