import React from 'react';
import { Link } from 'react-router-dom';

export function CarCard({ carro }) {
  return (
    <div className="car-card">
      <img src={carro.imagem} alt={`Foto do ${carro.modelo}`} />
      <div className="car-card-info">
        <h2>{carro.modelo}</h2>
        <p>{carro.marca} - {carro.ano}</p>
        <span>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(carro.preco)}
        </span>
        <Link to={`/carro/${carro.id}`} className="details-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}

