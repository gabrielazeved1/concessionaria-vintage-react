import React, { useState, useEffect } from 'react';
import { api } from '../services/api'; // Nossa instância do axios
import { CarCard } from '../components/CarCard'; // Nosso componente de card

export function Catalogo() {
  // 1. Cria um estado para armazenar a lista de carros. Começa como um array vazio.
  const [carros, setCarros] = useState([]);

  // 2. useEffect para buscar os dados da API quando o componente for montado.
  useEffect(() => {
    // Função async para poder usar 'await'
    async function fetchCarros() {
      try {
        const response = await api.get('/carros'); // Faz a requisição GET para /carros
        setCarros(response.data); // Atualiza o estado com os dados recebidos
      } catch (error) {
        console.error("Erro ao buscar carros:", error); // Loga um erro se a requisição falhar
      }
    }

    fetchCarros(); // Chama a função
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Carros</h1>
      <div className="car-list">
        {/* 3. Mapeia o array de carros e renderiza um CarCard para cada um */}
        {carros.map(carro => (
          <CarCard key={carro.id} carro={carro} />
        ))}
      </div>
    </div>
  );
}