// pages/index.js
import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Bienvenido a mi Dashboard 🚀</h1>
      <p>Usa el menú para navegar</p>
      <Link href="/dashboard">
        <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Ir al Dashboard</button>
      </Link>
    </div>
  );
}
