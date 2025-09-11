import { Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalogo } from './pages/Catalogo';
import { CarroDetalhes } from './pages/CarroDetalhes';
import { Carrinho } from './pages/Carrinho';
// define a estrutura visual padrao (layout) para as paginas > header + page + footer 
// define rotas


// garante que o header e o footer aparecam sempre
function MainLayout() {
  return (
    <>
      <Header />
      <main>
        {/* o outlet renderiza o componente da pagina atual aqui dentro */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// define rotas da aplicacao
function App() {
  return (
    <Routes>
      {/* cria um grupo de rotas que vai usar o 'mainlayout' como base */}
      <Route path="/" element={<MainLayout />}>
        {/* define que a pagina 'home' é a pagina inicial */}
        <Route index element={<Home />} />
        {/* define a rota '/catalogo' para a pagina de catalogo */}
        <Route path="catalogo" element={<Catalogo />} />
        {/* define a rota '/carrinho' para a pagina do carrinho */}
        <Route path="carrinho" element={<Carrinho />} />
        {/* define uma rota dinamica para os detalhes do carro, onde ':id' é variavel */}
        <Route path="carro/:id" element={<CarroDetalhes />} />
      </Route>
    </Routes>
  );
}

export default App;

