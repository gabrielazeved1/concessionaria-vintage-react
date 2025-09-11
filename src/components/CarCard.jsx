import React from 'react';
import { Link } from 'react-router-dom';

export function CarCard({ carro }) {
  return (
    <div className="car-card">
      <img src={carro.imagem} alt={`Foto do ${carro.modelo}`} />
      <div className="card-content">
        <h2>{carro.modelo}</h2>
        <p>{carro.marca} - {carro.ano} | {carro.cidade}</p>
        <span className="price">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(carro.preco)}
        </span>
        {/* Garantindo que o Link tem a classe "button" */}
        <Link to={`/carro/${carro.id}`} className="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}

