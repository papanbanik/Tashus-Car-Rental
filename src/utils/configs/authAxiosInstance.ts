import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_V2;

// Create a separate axios instance for authentication requests
// This instance doesn't have the token interceptor to avoid loops
export const authAxiosClient = axios.create({
  baseURL: `${apiUrl}`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Only add basic response handling (no auth redirects)
authAxiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let auth components handle their own errors
    return Promise.reject(error);
  }
);

export default authAxiosClient;