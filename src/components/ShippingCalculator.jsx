import React, { useState } from 'react';
import axios from 'axios';

// Mova a lógica de cálculo para fora para que possamos testá-la facilmente
const calculateShippingCost = (originState, destinationState) => {
  const rates = {
    'SP': { 'SP': 50, 'RJ': 150, 'MG': 200, 'OUTRO': 350 },
    'RJ': { 'RJ': 50, 'SP': 150, 'MG': 250, 'OUTRO': 400 },
    'MG': { 'MG': 50, 'SP': 200, 'RJ': 250, 'OUTRO': 300 },
  };
  const originRate = rates[originState] || rates['SP']; // Padrão para SP se a origem não estiver mapeada
  return originRate[destinationState] || originRate['OUTRO'];
};

export function ShippingCalculator({ originState }) {
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    setError('');
    setAddress(null);
    setShippingCost(null);

    // 1. LIMPEZA DO CEP: Remove tudo o que não for número
    const cleanedCep = cep.replace(/\D/g, '');

    // Validação do CEP limpo
    if (cleanedCep.length !== 8) {
      setError('CEP inválido. Por favor, digite 8 números.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      if (response.data.erro) {
        setError('CEP não encontrado.');
      } else {
        setAddress(response.data);
        const cost = calculateShippingCost(originState, response.data.uf);
        setShippingCost(cost);
      }
    } catch (err) {
      setError('Não foi possível buscar o CEP. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shipping-calculator">
      <h2>Calcular Frete e Prazo de Entrega</h2>
      <div className="input-group">
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Digite seu CEP (só números)"
        />
        <button onClick={handleCalculate} disabled={isLoading}>
          {isLoading ? 'A calcular...' : 'Calcular'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {address && (
        <div className="address-details">
          <p><strong>Cidade:</strong> {address.localidade} - {address.uf}</p>
          {/* 2. MELHORIA DA RUA: Mostra uma mensagem se a rua estiver vazia */}
          <p><strong>Rua:</strong> {address.logradouro || 'Não especificada'}</p>
        </div>
      )}

      {shippingCost !== null && (
        <div className="shipping-cost">
          Custo do Frete: <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingCost)}</strong>
        </div>
      )}
    </div>
  );
}

