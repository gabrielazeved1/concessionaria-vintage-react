//importacao 
import React from 'react'
import ReactDOM from 'react-dom/client'
// importa o componente principal da nossa aplicacao, o app
import App from './App.jsx'
// importa o componente que controla as rotas e a navegacao
import { BrowserRouter } from 'react-router-dom'
import './assets/global.css'

// encontra o elemento html com id 'root' no index.html e cria a raiz da aplicacao react
ReactDOM.createRoot(document.getElementById('root')).render(
  // strictmode é uma ferramenta do react para detetar potenciais problemas
  <React.StrictMode>
    {/* o browserrouter envolve toda a aplicacao para que as rotas funcionem em qualquer lugar */}
    <BrowserRouter>
      {/* renderiza o nosso componente principal, o app */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

