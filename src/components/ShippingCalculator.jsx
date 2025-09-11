import React, { useState } from 'react';
import axios from 'axios';

// Tabela de fretes expandida para todas as concessionárias
const shippingRates = {
  // Origem: Sudeste
  SP: { RJ: 500, MG: 600, PR: 400, RS: 1100, BA: 1600, SC: 700, ES: 900, DF: 900, GO: 950, PE: 2700, CE: 3100, AM: 3800 },
  RJ: { SP: 500, MG: 450, ES: 550, BA: 1200, DF: 1150, PR: 850, RS: 1550, PE: 2300, CE: 2800, AM: 4200 },
  MG: { SP: 600, RJ: 450, DF: 750, GO: 900, BA: 1400, ES: 550, PR: 1000, RS: 1700, PE: 2100, CE: 2600, AM: 3900 },

  // Origem: Sul
  PR: { SP: 400, SC: 300, RS: 700, MS: 950, RJ: 850, MG: 1000, DF: 1300, BA: 2200, PE: 3100, CE: 3500, AM: 4100 },
  RS: { PR: 700, SC: 450, SP: 1100, RJ: 1550, MG: 1700, DF: 2000, BA: 3000, PE: 3800, CE: 4200, AM: 4800 },

  // Origem: Centro-Oeste
  DF: { GO: 200, MG: 750, BA: 1400, MT: 1100, TO: 900, SP: 900, RJ: 1150, PR: 1300, RS: 2000, PE: 2100, CE: 2200, AM: 3500 },

  // Origem: Nordeste
  BA: { SE: 350, PE: 850, RJ: 1200, SP: 1600, MG: 1400, DF: 1400, TO: 1500, AL: 600, CE: 1300, AM: 4500, RS: 3000, PR: 2200 },
  PE: { BA: 850, AL: 260, PB: 120, RN: 280, CE: 800, DF: 2100, SP: 2700, RJ: 2300, MG: 2100, AM: 5000 },
  CE: { RN: 550, PI: 600, PE: 800, MA: 1000, BA: 1300, DF: 2200, SP: 3100, RJ: 2800, MG: 2600, AM: 5500 },

  // Origem: Norte
  AM: { PA: 2200, RR: 750, DF: 3500, SP: 3800, RJ: 4200, PR: 4100, RS: 4800, BA: 4500, PE: 5000, CE: 5500 },
};
const LOCAL_RATE = 150; // Custo fixo para entrega no mesmo estado
const DEFAULT_NATIONAL_RATE = 2500; // Custo padrão para rotas não tabeladas

// Função de cálculo que usa a tabela expandida
export function calculateShipping(originState, destinationState) {
  if (originState === destinationState) {
    return LOCAL_RATE;
  }
  const originRates = shippingRates[originState];
  if (originRates && originRates[destinationState]) {
    return originRates[destinationState];
  }
  return DEFAULT_NATIONAL_RATE;
}

export function ShippingCalculator({ originState }) {
  const [cep, setCep] = useState('');
  const [shippingInfo, setShippingInfo] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    setError('');
    setShippingInfo(null);
    setIsLoading(true);

    const cleanedCep = cep.replace(/\D/g, '');

    if (cleanedCep.length !== 8) {
      setError('CEP inválido. Por favor, insira 8 números.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      if (response.data.erro) {
        setError('CEP não encontrado.');
        setShippingInfo(null);
      } else {
        const cost = calculateShipping(originState, response.data.uf);
        setShippingInfo({
          city: response.data.localidade,
          state: response.data.uf,
          street: response.data.logradouro || 'Não especificada',
          cost: cost,
        });
        // Se estiver usando em CarroDetalhes, envie o valor para o pai
        if (typeof onFreteCalculado === 'function') {
          onFreteCalculado(cost);
        }
      }
    } catch (err) {
      setError('Não foi possível buscar o CEP. Tente novamente.');
      setShippingInfo(null);
    } finally {
      setIsLoading(false);
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
        <button onClick={handleCalculate} disabled={isLoading} className="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M12 12h.01"></path></svg>
          {isLoading ? 'A calcular...' : 'Calcular'}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {shippingInfo && (
        <div className="shipping-result">
          <p><strong>Cidade:</strong> {shippingInfo.city} - {shippingInfo.state}</p>
          <p><strong>Rua:</strong> {shippingInfo.street}</p>
          <p className="shipping-cost">
            <strong>Custo do Frete:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingInfo.cost)}
          </p>
        </div>
      )}
    </div>
  );
}

