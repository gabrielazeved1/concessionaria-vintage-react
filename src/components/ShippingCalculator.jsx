import React, { useState } from 'react';
import axios from 'axios';

export function ShippingCalculator({ originState }) {
  const [cep, setCep] = useState('');
  const [shippingInfo, setShippingInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Lógica de cálculo de frete simulado
  const calculateShippingCost = (destinationState) => {
    const rates = {
      'SP': { 'MG': 200, 'RJ': 150, 'SP': 50 },
      'RJ': { 'SP': 150, 'MG': 250, 'RJ': 50 },
      'MG': { 'SP': 200, 'RJ': 250, 'MG': 50 },
    };
    return rates[originState]?.[destinationState] || 950; // Retorna 950 se a rota não for encontrada
  };

  const handleCalculate = async () => {
    setError('');
    setShippingInfo(null);
    setLoading(true);

    const cleanedCep = cep.replace(/\D/g, ''); // Remove tudo que não for dígito

    if (cleanedCep.length !== 8) {
      setError('CEP inválido. Por favor, insira 8 números.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      if (response.data.erro) {
        setError('CEP não encontrado.');
        setShippingInfo(null);
      } else {
        const cost = calculateShippingCost(response.data.uf);
        setShippingInfo({
          city: response.data.localidade,
          state: response.data.uf,
          street: response.data.logradouro || 'Não especificada',
          cost: cost,
        });
      }
    } catch (err) {
      setError('Não foi possível buscar o CEP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shipping-calculator">
      <h3>Calcular Frete e Prazo de Entrega</h3>
      <div className="form-group">
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Digite seu CEP (só números)"
        />
        <button onClick={handleCalculate} disabled={loading} className="cta-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M12 12h.01"></path></svg>
          {loading ? 'A calcular...' : 'Calcular'}
        </button>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
      {shippingInfo && (
        <div className="shipping-result">
          <p><strong>Cidade:</strong> {shippingInfo.city} - {shippingInfo.state}</p>
          <p><strong>Rua:</strong> {shippingInfo.street}</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            <strong>Custo do Frete: R$ {shippingInfo.cost.toFixed(2)}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

