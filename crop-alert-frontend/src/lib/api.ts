import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // Your backend NestJS server URL
});
