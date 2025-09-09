import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { ShippingCalculator } from '../components/ShippingCalculator';

export function CarroDetalhes() {
  const { id } = useParams();
  const [carro, setCarro] = useState(null);
  const [franquia, setFranquia] = useState(null); // Estado para a franquia
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCarroEFranquia() {
      try {
        // 1. Busca o carro
        const carroResponse = await api.get(`/carros/${id}`);
        setCarro(carroResponse.data);

        // 2. Se o carro tiver uma franquia, busca os detalhes dela
        if (carroResponse.data.franquia) {
          const franquiaResponse = await api.get(`/franquias/${carroResponse.data.franquia}`);
          setFranquia(franquiaResponse.data);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCarroEFranquia();
  }, [id]);

  if (loading) {
    return <h1>A carregar...</h1>;
  }

  if (!carro) {
    return <h1>Carro não encontrado!</h1>
  }

  return (
    <>
      <div className="detalhes-container">
        <img src={carro.imagem} alt={`Foto do ${carro.modelo}`} />
        <div className="info">
          <h1>{carro.modelo}</h1>
          <h2>
            {carro.marca} - {carro.ano}
            {/* Agora lê os dados da franquia do seu próprio estado */}
            {franquia && ` | Origem: ${franquia.cidade}`}
          </h2>
          <p>{carro.descricao}</p>
          <span className="preco">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carro.preco)}
          </span>
        </div>
      </div>

      {/* Passa o estado da franquia para a calculadora */}
      {franquia && (
        <ShippingCalculator originState={franquia.estado} />
      )}
    </>
  );
}

