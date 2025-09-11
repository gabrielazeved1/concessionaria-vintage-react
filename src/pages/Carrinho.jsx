import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CarCard } from '../components/CarCard';

export function Carrinho() {
    const [carrinho, setCarrinho] = useState([]);
    const [franquias, setFranquias] = useState([]);

    useEffect(() => {
        async function fetchCarrinhoData() {
            const itens = JSON.parse(localStorage.getItem('carrinho')) || [];
            const franquiasResponse = await api.get('/franquias');
            const franquiasData = franquiasResponse.data;
            setFranquias(franquiasData);

            // Enriquecer os carros do carrinho com a cidade da franquia
            const franquiaMap = new Map(franquiasData.map(f => [String(f.id), f]));
            const itensComCidade = itens.map(carro => {
                const franquia = carro.franquiaId ? franquiaMap.get(String(carro.franquiaId)) : null;
                return {
                    ...carro,
                    cidade: franquia ? franquia.cidade : 'Desconhecida',
                    nomeFranquia: franquia ? franquia.nome : '',
                };
            });
            setCarrinho(itensComCidade);
        }
        fetchCarrinhoData();
    }, []);

    function limparCarrinho() {
        localStorage.removeItem('carrinho');
        setCarrinho([]);
    }

    function removerItem(idx) {
        const novoCarrinho = carrinho.filter((_, i) => i !== idx);
        setCarrinho(novoCarrinho);
        localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    }

    function handleAddToCart() {
        if (!carro) return;
        const frete = freteCalculado ?? 0;
        const item = { ...carro, frete };
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        localStorage.setItem('carrinho', JSON.stringify([...carrinho, item]));
        navigate('/carrinho');
}

    const totalFrete = carrinho.reduce((sum, item) => sum + (item.frete || 0), 0);
    const totalProdutos = carrinho.reduce((sum, item) => sum + item.preco, 0);
    const total = totalProdutos + totalFrete;

    return (
        <div>
            <h1>Meu Carrinho</h1>
            {carrinho.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
            ) : (
                <>
                    <div className="car-list">
                        {carrinho.map((carro, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                                <CarCard carro={carro} />
                                <p>
                                    Frete deste produto: {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    }).format(carro.frete || 0)}
                                </p>
                                <button
                                    className="button-secondary"
                                    style={{ marginBottom: 16 }}
                                    onClick={() => removerItem(idx)}
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
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