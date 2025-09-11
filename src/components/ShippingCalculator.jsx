import React, { useState } from 'react';
import axios from 'axios';


// tabela de frete
const shippingRates = {
  // origem: Sudeste
  SP: { RJ: 500, MG: 600, PR: 400, RS: 1100, BA: 1600, SC: 700, ES: 900, DF: 900, GO: 950, PE: 2700, CE: 3100, AM: 3800 },
  RJ: { SP: 500, MG: 450, ES: 550, BA: 1200, DF: 1150, PR: 850, RS: 1550, PE: 2300, CE: 2800, AM: 4200 },
  MG: { SP: 600, RJ: 450, DF: 750, GO: 900, BA: 1400, ES: 550, PR: 1000, RS: 1700, PE: 2100, CE: 2600, AM: 3900 },

  // origem: sul
  PR: { SP: 400, SC: 300, RS: 700, MS: 950, RJ: 850, MG: 1000, DF: 1300, BA: 2200, PE: 3100, CE: 3500, AM: 4100 },
  RS: { PR: 700, SC: 450, SP: 1100, RJ: 1550, MG: 1700, DF: 2000, BA: 3000, PE: 3800, CE: 4200, AM: 4800 },

  // origem: centro_oeste
  DF: { GO: 200, MG: 750, BA: 1400, MT: 1100, TO: 900, SP: 900, RJ: 1150, PR: 1300, RS: 2000, PE: 2100, CE: 2200, AM: 3500 },

  // origem: nordeste
  BA: { SE: 350, PE: 850, RJ: 1200, SP: 1600, MG: 1400, DF: 1400, TO: 1500, AL: 600, CE: 1300, AM: 4500, RS: 3000, PR: 2200 },
  PE: { BA: 850, AL: 260, PB: 120, RN: 280, CE: 800, DF: 2100, SP: 2700, RJ: 2300, MG: 2100, AM: 5000 },
  CE: { RN: 550, PI: 600, PE: 800, MA: 1000, BA: 1300, DF: 2200, SP: 3100, RJ: 2800, MG: 2600, AM: 5500 },

  // origem: norte
  AM: { PA: 2200, RR: 750, DF: 3500, SP: 3800, RJ: 4200, PR: 4100, RS: 4800, BA: 4500, PE: 5000, CE: 5500 },
};


// valor fixo para entrega no mesmo estado
const LOCAL_RATE = 150; 
// valor padrao se a rota nao estiver na tabela 
const DEFAULT_NATIONAL_RATE = 2500; 

// esta funcao faz a logica do calculo do frete
function calculateShipping(originState, destinationState) {
  // se a origem e o destino sao o mesmo, retorna a taxa local
  if (originState === destinationState) {
    return LOCAL_RATE;
  }
  // procura se existe uma rota definida na nossa tabela
  const originRates = shippingRates[originState];
  if (originRates && originRates[destinationState]) {
    return originRates[destinationState];
  }
  // se nao encontrou nenhuma rota, retorna o valor padrao
  return DEFAULT_NATIONAL_RATE;
}

// este é o componente da calculadora de frete
// ele recebe o estado de origem do carro como propriedade
export function ShippingCalculator({ originState, onFreteCalculado }) {
  // guarda o cep que o utilizador digita
  const [cep, setCep] = useState(''); 
  // guarda o resultado do frete
  const [shippingInfo, setShippingInfo] = useState(null); 
   // guarda mensagens de erro
  const [error, setError] = useState('');
  // controla se a busca esta a acontecer
  const [isLoading, setIsLoading] = useState(false); 

  // esta funcao é chamada quando o botao 'calcular' é clicado
  const handleCalculate = async () => {
    // faz tambem os tratamentos de rros
    // limpa os resultados e erros antigos
    setError('');
    setShippingInfo(null);
    // avisa que o calculo comecou
    setIsLoading(true); 

    // remove caracteres nao numericos do cep para a validacao
    const cleanedCep = cep.replace(/\D/g, '');

    // valida se o cep tem 8 digitos
    if (cleanedCep.length !== 8) {
      setError('CEP inválido. Por favor, insira 8 números.');
      setIsLoading(false);
      return; 
    }

    try {
      // faz a chamada para a api externa viacep para buscar o endereco
      const response = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      if (response.data.erro) {
        // se a api retorna um erro, exibe uma mensagem
        setError('CEP não encontrado.');
        setShippingInfo(null);
      } else {
        // se a api retorna sucesso, calcula o custo
        const cost = calculateShipping(originState, response.data.uf);
        // guarda as informacoes do resultado no estado
        setShippingInfo({
          city: response.data.localidade,
          state: response.data.uf,
          street: response.data.logradouro || 'Não especificada',
          cost: cost,
        });
        // esta funcao é usada para comunicar com o componente (carrinho)
        if (typeof onFreteCalculado === 'function') {
          onFreteCalculado(cost);
        }
      }
    } catch (err) {
      // se ocorrer um erro na chamada da api, exibe uma mensagem
      setError('Não foi possível buscar o CEP. Tente novamente.');
      setShippingInfo(null);
    } finally {
      // este bloco é executado sempre, com sucesso ou erro
      setIsLoading(false); // avisa que o calculo terminou
    }
  };

  // chamada da tela
  return (
    <div className="shipping-calculator">
      <h3>Calcular Frete e Prazo de Entrega</h3>
      <div className="form-group">
        <input
          type="text"
          value={cep} 
          // o valor do campo é controlado pelo estado 'cep'
          onChange={(e) => setCep(e.target.value)} 
          // atualiza o estado sempre que o utilizador digita
          placeholder="Digite seu CEP (só números)"
        />
        <button onClick={handleCalculate} disabled={isLoading} className="button">
          {/* o icone do botao */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M12 12h.01"></path></svg>
          {/* exibe 'a calcular...' se estiver a carregar, senao exibe 'calcular' */}
          {isLoading ? 'A calcular...' : 'Calcular'}
        </button>
      </div>
      {/* so exibe a mensagem de erro se a variavel 'error' nao estiver vazia */}
      {error && <p className="error-message">{error}</p>}
      {/* so exibe o resultado do frete se a variavel 'shippinginfo' nao for nula */}
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

