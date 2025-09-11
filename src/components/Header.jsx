// src/components/Header.jsx
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header>
      <h1>Concessionária Vintage</h1>
      <nav>
        {/* Usamos Link em vez de <a> para navegação interna no React */}
        <Link to="/">Home</Link>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/Carrinho">Carrinho</Link>
      </nav>
    </header>
  );
}