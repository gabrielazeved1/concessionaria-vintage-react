import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CarCard } from '../components/CarCard';

export function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);

  useEffect(() => {
    async function fetchFeaturedCars() {
      try {
        // Busca todos os carros e pega apenas os 3 primeiros com .slice(0, 3)
        const response = await api.get('/carros?_limit=3');
        setFeaturedCars(response.data);
      } catch (error) {
        console.error("Erro ao buscar carros em destaque:", error);
      }
    }
    fetchFeaturedCars();
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Encontre o Clássico dos Seus Sonhos</h1>
        <p>A maior coleção de carros antigos e raros do Brasil.</p>
        <Link to="/catalogo" className="cta-button">Ver Catálogo Completo</Link>
      </section>

      <section className="featured-cars">
        <h2>Nossos Destaques</h2>
        <div className="car-list">
          {featuredCars.map(carro => (
            <CarCard key={carro.id} carro={carro} />
          ))}
        </div>
      </section>
    </div>
  );
}
