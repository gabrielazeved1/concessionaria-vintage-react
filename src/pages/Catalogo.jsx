import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { CarCard } from '../components/CarCard';

export function Catalogo() {
  const [allCars, setAllCars] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    franchise: ''
  });

  // Busca os dados iniciais
  useEffect(() => {
    async function fetchData() {
      try {
        const [carsResponse, franchisesResponse] = await Promise.all([
          api.get('/carros'),
          api.get('/franquias')
        ]);
        setAllCars(carsResponse.data);
        setFranchises(franchisesResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, []);

  // Calcula a lista de marcas únicas
  const uniqueBrands = useMemo(() => {
    const brands = allCars.map(car => car.marca);
    return [...new Set(brands)];
  }, [allCars]);

  // Filtra os carros com base nos filtros selecionados
  const filteredCars = useMemo(() => {
    return allCars.filter(car => {
      const searchMatch = car.modelo.toLowerCase().includes(filters.search.toLowerCase());
      const brandMatch = filters.brand ? car.marca === filters.brand : true;
      // CORREÇÃO: Usamos '==' para comparar o 'franquiaId' (número) com o valor do filtro (string)
      const franchiseMatch = filters.franchise ? car.franquiaId == filters.franchise : true;
      return searchMatch && brandMatch && franchiseMatch;
    });
  }, [allCars, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', brand: '', franchise: '' });
  };

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Carros</h1>

      <div className="filters-container">
        <input
          type="text"
          name="search"
          placeholder="Pesquisar por modelo..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select name="brand" value={filters.brand} onChange={handleFilterChange}>
          <option value="">Todas as Marcas</option>
          {uniqueBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
        </select>
        <select name="franchise" value={filters.franchise} onChange={handleFilterChange}>
          <option value="">Todas as Concessionárias</option>
          {franchises.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
        </select>
        {/* CORREÇÃO: Adicionada a classe e um ícone ao botão */}
        <button onClick={handleClearFilters} className="button-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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

