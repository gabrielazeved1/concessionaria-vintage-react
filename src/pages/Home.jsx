import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CarCard } from '../components/CarCard';
import { Link } from 'react-router-dom';

// funcao para buscar os 3 ultimos carros adicionados, se nao achar vai dizer que deu ruim
export function Home() {
  
  const [featuredCars, setFeaturedCars] = useState([]);

  // o useeffect é usado para executar uma acao depois que o componente é renderizado
  // neste caso, ele vai buscar os dados na api
  useEffect(() => {
    // async pq pode demorar 
    async function fetchHomeData() {
      try {
        // o promise.all faz duas chamadas a api ao mesmo tempo
        const [carrosResponse, franquiasResponse] = await Promise.all([
          api.get('/carros?_limit=3'), 
          // busca os 3 primeiros carros
          api.get('/franquias')        
           // busca todas as franquias
        ]);

        const carros = carrosResponse.data;
        const franquias = franquiasResponse.data;

        // cria um map para encontrar a franquia de um carro pelo id de forma rapida
        // isso é tipoo uma query de sql -> junta duas linhas em uma unica lista 
        const franquiaMap = new Map(franquias.map(f => [String(f.id), f]));

        // adiciona a informacao da cidade em cada objeto de carro
        const carrosComCidade = carros.map(carro => {
          // encontra a franquia correspondente no map
          const franquia = carro.franquiaId ? franquiaMap.get(String(carro.franquiaId)) : null;
          return {
            ...carro, // mantem todos os dados originais do carro
            cidade: franquia ? franquia.cidade : 'Desconhecida', 
            // adiciona a cidade
          };
        });

        // guarda a lista final de carros (com a cidade) no estado
        setFeaturedCars(carrosComCidade);

      } catch (error) {
        // se der erro na busca, exibe uma mensagem no console
        console.error("Erro ao buscar dados da home:", error);
      }
    }

    // chama a funcao para buscar os dados
    fetchHomeData();
  }, []); // o array vazio garante que este useeffect roda apenas uma vez

  // esta é a parte visual da pagina
  return (
    <div>
      <div className="home-welcome">
        <h1>Encontre o Clássico dos Seus Sonhos</h1>
        <p>A maior coleção de carros antigos e raros do Brasil.</p>
        <Link to="/catalogo" className="button">Ver Catálogo Completo</Link>
      </div>

      <h2 className="featured-title">Nossos Destaques</h2>
      <div className="car-list">
        {/* o map percorre a lista de carros em destaque */}
        {/* para cada carro, ele renderiza um componente carcard */}
        {featuredCars.map(carro => (
          <CarCard key={carro.id} carro={carro} />
        ))}
      </div>
    </div>
  );
}

