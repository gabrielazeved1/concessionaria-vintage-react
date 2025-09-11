import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CarCard } from '../components/CarCard';


export function Carrinho() {
    // cria estados para guardar os dados da pagina
    const [carrinho, setCarrinho] = useState([]); 
    // guarda a lista de itens no carrinho
    const [franquias, setFranquias] = useState([]);
     // guarda a lista de todas as franquias

    // o useeffect busca os dados do carrinho no localstorage quando a pagina carrega
    useEffect(() => {
        async function fetchCarrinhoData() {
            // pega os itens guardados no 'localstorage' do navegador
            const itens = JSON.parse(localStorage.getItem('carrinho')) || [];
            // busca os dados de todas as franquias para sabermos a cidade de origem
            const franquiasResponse = await api.get('/franquias');
            const franquiasData = franquiasResponse.data;
            setFranquias(franquiasData);

            // cria um map para encontrar a franquia de um carro pelo id
            const franquiaMap = new Map(franquiasData.map(f => [String(f.id), f]));
            // enriquece os dados dos carros no carrinho com a informacao da cidade
            const itensComCidade = itens.map(carro => {
                const franquia = carro.franquiaId ? franquiaMap.get(String(carro.franquiaId)) : null;
                return {
                    ...carro,
                    cidade: franquia ? franquia.cidade : 'Desconhecida',
                };
            });
            // guarda a lista final de itens no estado
            setCarrinho(itensComCidade);
        }
        fetchCarrinhoData();
    }, []); // o array vazio garante que isto roda apenas uma vez

    //  funcao apaga todos os itens do carrinho
    function limparCarrinho() {
        localStorage.removeItem('carrinho'); 
        // remove do localstorage
        setCarrinho([]); 
        // limpa o estado local
    }

    // funcao remove um item especifico do carrinho
    function removerItem(idx) {
        // o filter cria uma nova lista contendo todos os itens, exceto o que foi removido
        const novoCarrinho = carrinho.filter((_, i) => i !== idx);
        setCarrinho(novoCarrinho); 
        // atualiza o estado com a nova lista
        localStorage.setItem('carrinho', JSON.stringify(novoCarrinho)); 
        // atualiza o localstorage
    }

    // a funcao 'reduce' é usada para somar valores de uma lista
    // aqui, ela soma o valor do frete de todos os itens do carrinho
    const totalFrete = carrinho.reduce((sum, item) => sum + (item.frete || 0), 0);
    // aqui, ela soma o preco de todos os itens do carrinho
    const totalProdutos = carrinho.reduce((sum, item) => sum + item.preco, 0);
    // calcula o valor total da compra
    const total = totalProdutos + totalFrete;

    // esta é a parte visual da pagina
    return (
        <div>
            <h1>Meu Carrinho</h1>
            {/* se o carrinho estiver vazio, exibe uma mensagem */}
            {carrinho.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
            ) : (
                // senao, exibe a lista de itens e os totais
                <>
                    <div className="car-list">
                        {carrinho.map((carro, idx) => (
                            <div key={idx}>
                                <CarCard carro={carro} />
                                <p>
                                    Frete deste produto: {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    }).format(carro.frete || 0)}
                                </p>
                                <button
                                    className="button-secondary"
                                    onClick={() => removerItem(idx)}
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* exibe os totais calculados */}
                    <h2>
                        Total dos produtos: {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(totalProdutos)}
                    </h2>
                    <h2>
                        Total dos fretes: {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(totalFrete)}
                    </h2>
                    <h2>
                        Total geral: {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(total)}
                    </h2>
                    <button className="button-secondary" onClick={limparCarrinho}>
                        Limpar Carrinho
                    </button>
                </>
            )}
        </div>
    );
}
