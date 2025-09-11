import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CarCard } from '../components/CarCard';
import { Link } from 'react-router-dom';

export function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        // Passo 1: Busca os carros e TODAS as franquias ao mesmo tempo.
        // É mais rápido do que buscar uma por uma.
        const [carrosResponse, franquiasResponse] = await Promise.all([
          api.get('/carros?_limit=3'), // Pega os 3 carros em destaque
          api.get('/franquias')         // Pega TODAS as franquias
        ]);

        const carros = carrosResponse.data;
        const franquias = franquiasResponse.data;

        // Passo 2: Cria um "mapa" para encontrar franquias por ID facilmente.
        // Pense nisso como um índice de um livro.
        const franquiaMap = new Map(franquias.map(f => [String(f.id), f]));

        // Passo 3: "Enriquece" os dados dos carros com a cidade da franquia.
        const carrosComCidade = carros.map(carro => {
          const franquia = carro.franquiaId ? franquiaMap.get(String(carro.franquiaId)) : null;
          return {
            ...carro, // Mantém todos os dados originais do carro
            cidade: franquia ? franquia.cidade : 'Desconhecida', // Adiciona a cidade
            nomeFranquia: franquia ? franquia.nome : '',         // se quiser mostrar o nome também
          };
        });

        // Passo 4: Guarda os carros já com os dados completos no estado.
        console.log(carrosComCidade); // Adicione antes do setFeaturedCars
        setFeaturedCars(carrosComCidade);

      } catch (error) {
        console.error("Erro ao buscar dados da home:", error);
      }
    }

    fetchHomeData();
  }, []); // O array vazio garante que isso só roda uma vez

  return (
    <div>
      <div className="home-welcome">
        <h1>Encontre o Clássico dos Seus Sonhos</h1>
        <p>A maior coleção de carros antigos e raros do Brasil.</p>
        <Link to="/catalogo" className="button">Ver Catálogo Completo</Link>
      </div>

      <h2 className="featured-title">Nossos Destaques</h2>
      <div className="car-list">
        {/* Agora o componente CarCard receberá o objeto 'carro' já com a cidade */}
        {featuredCars.map(carro => (
          <CarCard key={carro.id} carro={carro} />
        ))}
      </div>
    </div>
  );
}