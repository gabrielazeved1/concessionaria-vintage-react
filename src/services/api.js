import axios from 'axios';

// Cria uma instância do axios com a URL base da nossa API
export const api = axios.create({
  baseURL: 'http://localhost:3001'
});