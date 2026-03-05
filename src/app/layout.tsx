import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'T3 Experience - Mapa de Stands',
  description: 'Mapa interativo de stands do evento T3 Experience. Gerencie vendas e reservas em tempo real.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-950 text-white antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
