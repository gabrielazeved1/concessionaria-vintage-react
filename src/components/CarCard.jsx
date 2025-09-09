import React from 'react';
import { Link } from 'react-router-dom'; // 1. Importe o Link

export function CarCard({ carro }) {
  return (
    <div className="car-card">
      <img src={carro.imagem} alt={`Foto do ${carro.modelo}`} />
      <h2>{carro.modelo}</h2>
      <p>{carro.marca} - {carro.ano}</p>
      <span>
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(carro.preco)}
      </span>
      {/* 2. Substitua o botão pelo Link. O `to` constrói a URL dinamicamente */}
      <Link to={`/carro/${carro.id}`} className="details-button">
        Ver Detalhes
      </Link>
    </div>
  );
}
