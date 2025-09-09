import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { ShippingCalculator } from '../components/ShippingCalculator';

export function CarroDetalhes() {
  const { id } = useParams();
  const [carro, setCarro] = useState(null);
  const [franquia, setFranquia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCarDetails() {
      try {
        setLoading(true);
        // Passo 1: Busca os dados do carro
        const carroResponse = await api.get(`/carros/${id}`);
        const carroData = carroResponse.data;
        setCarro(carroData);

        // Passo 2: Se o carro foi encontrado e tem um franquiaId, busca os dados da franquia
        if (carroData && carroData.franquiaId) {
          const franquiaResponse = await api.get(`/franquias/${carroData.franquiaId}`);
          setFranquia(franquiaResponse.data);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do carro:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCarDetails();
  }, [id]);

  if (loading) {
    return <h2>A carregar...</h2>;
  }

  if (!carro) {
    return <h2>Carro não encontrado!</h2>;
  }

  return (
    <div className="car-details-page">
      <div className="details-card">
        <img src={carro.imagem} alt={`Foto do ${carro.modelo}`} className="details-image" />
        <div className="details-info">
          <h1>{carro.modelo}</h1>
          <h2>
            {carro.marca} - {carro.ano}
            {franquia && ` | Origem: ${franquia.cidade}`} {/* Mostra a cidade da franquia */}
          </h2>
          <p>{carro.descricao}</p>
          <span className="details-price">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(carro.preco)}
          </span>
        </div>
      </div>

      {/* A calculadora só aparece se tivermos os dados da franquia */}
      {franquia && (
        <ShippingCalculator originState={franquia.estado} />
      )}
    </div>
  );
}

