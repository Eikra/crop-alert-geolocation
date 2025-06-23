import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.BACKEND_URL, // Your backend NestJS server URL
});
