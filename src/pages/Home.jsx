import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CarCard } from '../components/CarCard';
import { Link } from 'react-router-dom'; // Precisamos de importar o Link

export function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);

  useEffect(() => {
    async function fetchFeaturedCars() {
      try {
        // Busca todos os carros e pega apenas os 3 primeiros como destaque
        const response = await api.get('/carros?_limit=3');
        setFeaturedCars(response.data);
      } catch (error) {
        console.error("Erro ao buscar carros em destaque:", error);
      }
    }

    fetchFeaturedCars();
  }, []);

  return (
    <div>
      <div className="home-welcome">
        <h1>Encontre o Clássico dos Seus Sonhos</h1>
        <p>A maior coleção de carros antigos e raros do Brasil.</p>
        {/* AQUI APLICAMOS A CLASSE "button" AO LINK */}
        <Link to="/catalogo" className="button">Ver Catálogo Completo</Link>
      </div>

      <h2 className="featured-title">Nossos Destaques</h2>
      <div className="car-list">
        {featuredCars.map(carro => (
          <CarCard key={carro.id} carro={carro} />
        ))}
      </div>
    </div>
  );
}

