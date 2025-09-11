import { Link } from 'react-router-dom';

// este componente renderiza o cabecalho que aparece em todas as paginas
export function Header() {
  return (
    // a tag header é o container principal do cabecalho
    // sendo container diferente de asa -> caixa 
    <header>
      {/* o h1 é o titulo principal do site */}
      <h1>Concessionária Vintage</h1>
      {/* a tag nav é usada para os links de navegacao */}
      <nav>
        {/* o componente link cria uma navegacao interna sem recarregar a pagina */}
        {/* o 'to' define para qual rota o link vai levar o utilizador */}
        <Link to="/">Home</Link>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/carrinho">Carrinho</Link>
      </nav>
    </header>
  );
}
