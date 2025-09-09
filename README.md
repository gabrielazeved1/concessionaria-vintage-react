# Concessionária Vintage - Catálogo de Veículos Clássicos

Este projeto é uma aplicação web completa desenvolvida como parte da disciplina de Tecnologia Web. A aplicação simula o site de uma concessionária de carros e motos de coleção, com múltiplas franquias pelo Brasil. A principal funcionalidade é um catálogo de veículos com filtros avançados e um sistema de cálculo de frete em tempo real, baseado no CEP do utilizador.

## Funcionalidades Principais

* **Página Inicial Dinâmica:** Apresenta os veículos em destaque para atrair o utilizador.
* **Catálogo Completo:** Exibe todos os veículos disponíveis com um sistema de pesquisa por modelo e filtros por marca e concessionária.
* **Página de Detalhes:** Mostra informações completas de cada veículo, incluindo galeria de fotos, descrição e ficha técnica.
* **Cálculo de Frete Inteligente:** Na página de detalhes, o utilizador pode inserir o seu CEP. A aplicação consome a API externa ViaCEP para obter o endereço e, com base no estado de origem do veículo e no estado de destino, calcula um valor de frete simulado.

## Demonstração Visual

### 1. Página Inicial
![](/images/foto2.png)
*A página inicial apresenta os destaques da coleção e convida o utilizador a explorar o catálogo.*

### 2. Catálogo com Filtros
![](/images/foto1.png)
*O catálogo permite a pesquisa e filtragem dos veículos, facilitando a navegação do utilizador.*

### 3. Detalhes do Veículo e Cálculo de Frete
![](/images/foto3.png)
*A página de detalhes exibe todas as informações do veículo e a funcionalidade de cálculo de frete baseada no CEP.*

## Tecnologias e Arquitetura

### Linguagem e Biblioteca Principal

* **JavaScript (ES6+):** A linguagem de programação padrão para o desenvolvimento web, utilizada para toda a lógica da aplicação.
* **React (v18):** Escolhemos o React como a biblioteca principal para a construção da interface do utilizador (UI). A sua abordagem baseada em componentes permite-nos criar uma UI modular, reutilizável e fácil de manter. A gestão de estado com Hooks (`useState`, `useEffect`) e o ecossistema robusto (como o `react-router-dom` para navegação) tornam o desenvolvimento de Single-Page Applications (SPAs) eficiente e escalável.

### Estrutura de Pastas e Ficheiros

O projeto está organizado de forma a separar as responsabilidades, seguindo as melhores práticas do ecossistema React. Abaixo está um detalhe da função de cada ficheiro principal:

```propriets
/
├── images/                 # Contém as imagens de demonstração para o README
│   ├── foto1.png
│   ├── foto2.png
│   └── foto3.png
├── src/
│   ├── assets/
│   │   └── global.css          # Ficheiro central de estilos para toda a aplicação.
│   ├── components/
│   │   ├── CarCard.jsx         # Componente reutilizável que exibe um único veículo.
│   │   ├── Footer.jsx          # Componente do rodapé, presente em todas as páginas.
│   │   ├── Header.jsx          # Componente do cabeçalho, com o título e a navegação.
│   │   └── ShippingCalculator.jsx # Componente com a lógica do cálculo de frete.
│   ├── pages/
│   │   ├── CarroDetalhes.jsx   # Página que exibe os detalhes de um veículo específico.
│   │   ├── Catalogo.jsx        # Página do catálogo, com a lógica de busca e filtros.
│   │   └── Home.jsx            # Página inicial da aplicação com os destaques.
│   ├── services/
│   │   └── api.js              # Configuração central do Axios para chamadas à API.
│   ├── App.jsx                 # Componente raiz que define o layout e as rotas.
│   └── main.jsx                # Ponto de entrada que renderiza a aplicação no DOM.
│
├── .dockerignore               # Lista ficheiros a serem ignorados pelo Docker na construção.
├── db.json                     # Simula o banco de dados para o json-server.
├── docker-compose.yml          # Orquestra a inicialização dos contentores da aplicação e API.
├── Dockerfile.dev              # "Receita" para construir a imagem Docker de desenvolvimento.
└── package.json                # Define os scripts e as dependências do projeto.
```
## Ambiente de Desenvolvimento com Docker

### Importância e Facilitação

Para garantir um ambiente de desenvolvimento consistente, portátil e livre de problemas de configuração ("na minha máquina funciona"), o projeto foi totalmente containerizado com Docker.

* **Consistência:** O Docker garante que a aplicação corre sempre sobre a mesma versão do Node.js e com as mesmas dependências, independentemente do sistema operativo do programador.
* **Isolamento:** A aplicação e a sua API falsa correm em contentores isolados, o que significa que não interferem com outras aplicações ou serviços instalados na máquina local.
* **Facilidade de Configuração:** Um novo programador não precisa de instalar Node.js, `json-server` ou qualquer outra dependência globalmente. Basta ter o Docker instalado e executar um único comando (`docker-compose up`) para ter todo o ambiente a funcionar em minutos.
* **Live Reloading:** A configuração utiliza *volumes* do Docker para espelhar a pasta do código-fonte local para dentro do contentor. Isto permite que qualquer alteração no código seja detetada pelo Vite (o nosso servidor de desenvolvimento) e refletida instantaneamente no navegador, mantendo a produtividade alta.

## Como Executar o Projeto

### Pré-requisitos

Antes de começar, garanta que tem os seguintes softwares instalados na sua máquina:
* [Git](https://git-scm.com/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Passos para a Execução

1.  **Clonar o Repositório:**
    Abra um terminal e clone o projeto para a sua máquina local.
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd [NOME_DA_PASTA_DO_PROJETO]
    ```

2.  **Construir e Iniciar os Contentores:**
    Com o Docker Desktop a correr, execute o seguinte comando na raiz do projeto. Este comando irá ler o `docker-compose.yml`, construir a imagem da sua aplicação e iniciar os dois contentores (front-end e API).
    ```bash
    docker-compose up --build
    ```
    A primeira execução pode demorar alguns minutos enquanto o Docker descarrega as imagens base e instala as dependências. As execuções subsequentes serão muito mais rápidas.

3.  **Aceder à Aplicação e API:**
    Após o processo terminar, os seus serviços estarão disponíveis nos seguintes endereços:
    * **Aplicação Front-end:** [http://localhost:5173](http://localhost:5173)
    * **API Falsa (json-server):** [http://localhost:3001](http://localhost:3001)

    Pode aceder ao endereço da API diretamente no seu navegador para visualizar os dados em formato JSON. Por exemplo, para ver todos os carros, aceda a [http://localhost:3001/carros](http://localhost:3001/carros).

Para parar os contentores, basta pressionar `Ctrl + C` no terminal onde o `docker-compose` está a correr.

## Conclusão

O projeto "Concessionária Vintage" demonstra com sucesso a aplicação prática de tecnologias web modernas para a construção de uma aplicação de página única (SPA) funcional e interativa. Através do uso do React, foi possível criar uma interface componentizada e reativa, enquanto a integração com APIs externas (ViaCEP) e a simulação de uma API interna (`json-server`) permitiram o desenvolvimento de funcionalidades complexas, como o cálculo de frete dinâmico.

Além disso, a containerização com Docker assegura a portabilidade e a consistência do ambiente de desenvolvimento, representando uma prática profissional essencial no cenário tecnológico atual. O resultado final é um projeto robusto, bem documentado e que serve como um excelente portfólio das competências adquiridas na disciplina de Tecnologia Web.

