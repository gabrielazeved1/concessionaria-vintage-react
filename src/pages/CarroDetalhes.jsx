import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Hook para pegar parâmetros da URL
import { api } from '../services/api';

export function CarroDetalhes() {
  // 1. O useParams retorna um objeto com os parâmetros da URL. Queremos o 'id'.
  const { id } = useParams();

  // 2. Estado para armazenar os dados do carro. Começa como null.
  const [carro, setCarro] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    async function fetchCarro() {
      try {
        // 3. Busca na API pelo carro específico: /carros/1, /carros/2, etc.
        const response = await api.get(`/carros/${id}`);
        setCarro(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do carro:", error);
      } finally {
        setLoading(false); // Garante que o loading termine, mesmo com erro
      }
    }

    fetchCarro();
  }, [id]); // O useEffect vai rodar novamente se o 'id' na URL mudar

  // 4. Mostra uma mensagem de carregamento enquanto os dados não chegam
  if (loading) {
    return <h1>A carregar...</h1>;
  }

  // 5. Se, após o carregamento, o carro não for encontrado
  if (!carro) {
    return <h1>Carro não encontrado!</h1>
  }

  // 6. Renderiza os detalhes do carro
  return (
    <div className="detalhes-container">
      <img src={carro.imagem} alt={`Foto do ${carro.modelo}`} />
      <div className="info">
        <h1>{carro.modelo}</h1>
        <h2>{carro.marca} - {carro.ano}</h2>
        <p>{carro.descricao}</p>
        <span className="preco">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(carro.preco)}
        </span>
      </div>
    </div>
  );
}
