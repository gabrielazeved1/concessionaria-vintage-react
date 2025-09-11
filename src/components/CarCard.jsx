import React from 'react';
import { Link } from 'react-router-dom';

// exibir um unico carro 
// ele recebe um objeto 'carro' com todas as informacoes como propriedade (prop)

export function CarCard({ carro }) {
  return (
    // o container principal do cartao com a classe para estilizacao
    <div className="car-card">
      {/* exibe a imagem do carro. o 'alt' é um texto alternativo para acessibilidade */}
      <img src={carro.imagem} alt={`Foto do ${carro.modelo}`} />
      {/* o container para o conteudo de texto do cartao */}
      <div className="card-content">
        {/* exibe o modelo do carro */}
        <h2>{carro.modelo}</h2>
        {/* exibe a marca, ano e a cidade do carro */}
        <p>{carro.marca} - {carro.ano}</p>
        {/* container para o preco, com classe para estilizacao */}
        <span className="price">
          {/* formata o numero do preco para real */}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(carro.preco)}
        </span>
        {/* cria um link que leva para a pagina de detalhes do carro especifico */}
        {/* o ` é usado para criar uma string dinamica com o id do carro */}
        <Link to={`/carro/${carro.id}`} className="button">
          {/* este é o icone svg dentro do botao */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}

