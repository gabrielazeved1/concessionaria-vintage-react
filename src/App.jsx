import { Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalogo } from './pages/Catalogo';
import { CarroDetalhes } from './pages/CarroDetalhes';

// Componente de Layout que define a estrutura da página
function MainLayout() {
  return (
    <>
      <Header />
      <main>
        {/* O conteúdo da página atual será renderizado aqui */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// Componente principal que define as rotas
function App() {
  return (
    <Routes>
      {/* Todas as rotas dentro daqui usarão o MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* A página inicial */}
        <Route index element={<Home />} />
        {/* A página de catálogo */}
        <Route path="catalogo" element={<Catalogo />} />
        {/* A página de detalhes de um carro específico */}
        <Route path="carro/:id" element={<CarroDetalhes />} />
      </Route>
    </Routes>
  );
}

export default App;
