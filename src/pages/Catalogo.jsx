import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { CarCard } from '../components/CarCard';

export function Catalogo() {
  const [carros, setCarros] = useState([]);
  const [franquias, setFranquias] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    marca: 'all',
    franquia: 'all',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [carrosResponse, franquiasResponse] = await Promise.all([
          api.get('/carros'),
          api.get('/franquias')
        ]);
        setCarros(carrosResponse.data);
        setFranquias(franquiasResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      marca: 'all',
      franquia: 'all',
    });
  };

  const uniqueMarcas = useMemo(() => {
    const marcas = carros.map(carro => carro.marca);
    return [...new Set(marcas)].sort();
  }, [carros]);

  const filteredCars = useMemo(() => {
    return carros
      .filter(carro => {
        const searchTermMatch = carro.modelo.toLowerCase().includes(filters.searchTerm.toLowerCase());
        const brandMatch = filters.marca === 'all' || carro.marca === filters.marca;
        
        // CORREÇÃO: Converte o valor do filtro para número antes de comparar
        const franquiaMatch = filters.franquia === 'all' || carro.franquiaId === parseInt(filters.franquia, 10);
        
        return searchTermMatch && brandMatch && franquiaMatch;
      });
  }, [carros, filters]);

  return (
    <div>
      <h1>Catálogo de Carros</h1>
      <div className="filters-container">
        <input
          type="text"
          name="searchTerm"
          placeholder="Pesquisar por modelo..."
          value={filters.searchTerm}
          onChange={handleFilterChange}
        />
        <select name="marca" value={filters.marca} onChange={handleFilterChange}>
          <option value="all">Todas as Marcas</option>
          {uniqueMarcas.map(marca => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>
        <select name="franquia" value={filters.franquia} onChange={handleFilterChange}>
          <option value="all">Todas as Concessionárias</option>
          {franquias.map(franquia => (
            <option key={franquia.id} value={franquia.id}>
              {franquia.nome}
            </option>
          ))}
        </select>
        <button onClick={clearFilters} className="button-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          Limpar Filtros
        </button>
      </div>
      
      {filteredCars.length > 0 ? (
        <div className="car-list">
          {filteredCars.map(carro => (
            <CarCard key={carro.id} carro={carro} />
          ))}
        </div>
      ) : (
        <p>Nenhum carro encontrado com os filtros selecionados.</p>
      )}
    </div>
  );
}

