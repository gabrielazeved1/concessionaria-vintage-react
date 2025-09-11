import axios from 'axios';

// cria uma instancia do axios com a url base da nossa Api
// axios é quem conversa com o backend
export const api = axios.create({
  baseURL: 'http://localhost:3001'
});