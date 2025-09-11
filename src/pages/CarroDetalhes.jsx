import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ShippingCalculator } from '../components/ShippingCalculator';

// este é o componente da pagina de detalhes de um carro
export function CarroDetalhes() {
  // pega o ID da url do carro
  const { id } = useParams();
  const navigate = useNavigate(); 
  // inicializa a funcao de navegacao


  // cria estados para guardar os dados da pagina
  const [carro, setCarro] = useState(null);
   // guarda os dados do carro especifico
  const [franquia, setFranquia] = useState(null); 
  // guarda os dados da franquia do carro
  const [loading, setLoading] = useState(true); 
  // controla se a pagina esta a carregar
  const [freteCalculado, setFreteCalculado] = useState(null); 
  // guarda o valor do frete calculado

  // esta funcao é chamada quando o botao 'adicionar ao carrinho' é clicado
  function handleAddToCart() {
    // se os dados do carro ainda nao carregaram, nao faz nada
    if (!carro) return;
    // define o frete como o valor calculado ou zero se nao foi calculado
    const frete = freteCalculado ?? 0;
    // cria um novo objeto 'item' com os dados do carro e o valor do frete
    const item = { ...carro, frete };
    // pega o carrinho que ja existe no 'localstorage' do navegador
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    // adiciona o novo item ao carrinho e guarda de volta no 'localstorage'
    localStorage.setItem('carrinho', JSON.stringify([...carrinho, item]));
    // redireciona o utilizador para a pagina do carrinho
    navigate('/carrinho');
  }

  // o useeffect busca os dados do carro e da franquia quando a pagina carrega
  useEffect(() => {
    async function fetchCarDetails() {
      try {
        setLoading(true); 
        // avisa que o carregamento comecou
        // busca os dados do carro especifico usando o id da url
        const carroResponse = await api.get(`/carros/${id}`);
        const carroData = carroResponse.data;
        setCarro(carroData); 
        // guarda os dados do carro no estado

        // se o carro foi encontrado, busca os dados da sua franquia
        if (carroData && carroData.franquiaId) {
          const franquiaResponse = await api.get(`/franquias/${carroData.franquiaId}`);
          setFranquia(franquiaResponse.data); 
          // guarda os dados da franquia no estado
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do carro:", error);
      } finally {
        setLoading(false); 
        // avisa que o carregamento terminou
      }
    }

    fetchCarDetails();
  }, [id]); 
  // este efeito roda novamente se o 'id' na url mudar

  
  // se a pagina estiver a carregar, exibe uma mensagem
  if (loading) {
    return <h2>A carregar...</h2>;
  }

  // se o carro nao for encontrado, exibe outra mensagem
  if (!carro) {
    return <h2>Carro não encontrado!</h2>;
  }

  // esta é a parte visual da pagina
  return (
    <div className="details-container">
      <div className="details-image">
        <img src={carro.imagem} alt={`Foto do ${carro.modelo}`} />
      </div>
      <div className="details-info">
        <h1>{carro.modelo}</h1>
        <h2>
          {carro.marca} - {carro.ano}
          {/* so exibe a cidade de origem se os dados da franquia ja foram carregados */}
          {franquia && ` | Origem: ${franquia.cidade}`}
        </h2>
        <p>{carro.descricao}</p>
        <span className="price">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(carro.preco)}
        </span>
      </div>
      
      {/* so renderiza a calculadora de frete se os dados da franquia existirem */}
      {franquia && (
        <ShippingCalculator 
          originState={franquia.estado} 
          onFreteCalculado={setFreteCalculado}
        />
      )}

      {/* botao para adicionar o item ao carrinho */}
      {/* ele fica desativado ate que o frete seja calculado */}
      <button 
        className="button"
        onClick={handleAddToCart}
        disabled={freteCalculado === null}
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
}

