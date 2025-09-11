import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { CarCard } from '../components/CarCard';
// guarda listas, chama api, map { dicionario que mostra}, pesquisa e limpa

export function Catalogo() {
  // cria const para guardar os dados da pagina
  const [carros, setCarros] = useState([]); 
  // guarda a lista completa de carros
  const [franquias, setFranquias] = useState([]); 
  // guarda a lista de franquias
  const [filters, setFilters] = useState({ // guarda os valores atuais dos filtros
    searchTerm: '',
    marca: 'all',
    franquia: 'all',
  });

  // o useeffect vai buscar os dados na api quando a pagina carrega
  useEffect(() => {
    async function fetchData() {
      try {
        // busca os carros e as franquias ao mesmo tempo
        const [carrosResponse, franquiasResponse] = await Promise.all([
          api.get('/carros'),
          api.get('/franquias')
        ]);

        const carros = carrosResponse.data;
        const franquiasData = franquiasResponse.data;

        // cria um map para encontrar a franquia de um carro pelo id -> lembrar da query 
        const franquiaMap = new Map(franquiasData.map(f => [String(f.id), f]));
        // adiciona a cidade em cada objeto de carro para ser exibida
        const carrosComCidade = carros.map(carro => {
          const franquia = carro.franquiaId ? franquiaMap.get(String(carro.franquiaId)) : null;
          return {
            ...carro,
            cidade: franquia ? franquia.cidade : 'Desconhecida',
          };
        });

        // guarda os dados recebidos nos estados
        setCarros(carrosComCidade);
        setFranquias(franquiasData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }
    fetchData();
  }, []); 

  // esta funcao é chamada sempre que um filtro é alterado
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // atualiza o estado dos filtros com o novo valor
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // esta funcao limpa todos os filtros quando o botao é clicado
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      marca: 'all',
      franquia: 'all',
    });
  };

  // o usememo otimiza o calculo da lista de marcas unicas
  // ele so recalcula esta lista se o array 'carros' mudar
  const uniqueMarcas = useMemo(() => {
    const marcas = carros.map(carro => carro.marca);
    return [...new Set(marcas)].sort();
  }, [carros]);

  // o usememo tambem otimiza a filtragem dos carros
  // ele so refaz a filtragem se a lista de 'carros' ou os 'filters' mudarem
  const filteredCars = useMemo(() => {
    return carros
      .filter(carro => {
        // verifica se o texto da pesquisa corresponde ao modelo do carro
        const searchTermMatch = carro.modelo.toLowerCase().includes(filters.searchTerm.toLowerCase());
        // verifica se a marca selecionada corresponde a marca do carro
        const brandMatch = filters.marca === 'all' || carro.marca === filters.marca;
        // verifica se a franquia selecionada corresponde a franquia do carro
        const franquiaMatch = filters.franquia === 'all' || carro.franquiaId == filters.franquia;

        // o carro so aparece se todas as condicoes forem verdadeiras
        return searchTermMatch && brandMatch && franquiaMatch;
      });
  }, [carros, filters]);

  // esta é a parte visual do componente
  return (
    <div>
      <h1>Catálogo de Carros</h1>
      <div className="filters-container">
        {/* campo de texto para a pesquisa por modelo */}
        <input
          type="text"
          name="searchTerm"
          placeholder="Pesquisar por modelo..."
          value={filters.searchTerm}
          onChange={handleFilterChange}
        />
        {/* menu para selecionar a marca */}
        <select name="marca" value={filters.marca} onChange={handleFilterChange}>
          <option value="all">Todas as Marcas</option>
          {uniqueMarcas.map(marca => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>
        {/* menu para selecionar a concessionaria */}
        <select name="franquia" value={filters.franquia} onChange={handleFilterChange}>
          <option value="all">Todas as Concessionárias</option>
          {franquias.map(franquia => (
            <option key={franquia.id} value={franquia.id}>
              {franquia.nome}
            </option>
          ))}
        </select>
        {/* botao para limpar os filtros */}
        <button onClick={clearFilters} className="button-secondary">
          <svg xmlns="http://www.w.3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          Limpar Filtros
        </button>
      </div>

      {/* esta é uma renderizacao condicional */}
      {/* se a lista de carros filtrados tiver itens, mostra a lista */}
      {filteredCars.length > 0 ? (
        <div className="car-list">
          {filteredCars.map(carro => (
            <CarCard key={carro.id} carro={carro} />
          ))}
        </div>
      ) : (
        // senao, mostra uma mensagem a dizer que nada foi encontrado
        <p>Nenhum carro encontrado com os filtros selecionados.</p>
      )}
    </div>
  );
}

