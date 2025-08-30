/**
 * Centralized API Configuration
 * 
 * This file contains all API base URLs and endpoint configurations
 * for the vGuard application across different environments.
 */

interface ApiConfig {
  baseURL: string;
  apiURL: string;
}

interface EnvironmentConfig {
  development: ApiConfig;
  production: ApiConfig;
}

const API_CONFIG: EnvironmentConfig = {
  development: {
    baseURL: 'http://localhost:5001',
    apiURL: 'http://localhost:5001/api'
  },
  production: {
    baseURL: 'https://vgurad-backend.onrender.com',
    apiURL: 'https://vgurad-backend.onrender.com/api'
  }
};

// Determine current environment
const environment = (import.meta.env.MODE || 'development') as keyof EnvironmentConfig;
const isDevelopment = environment === 'development';
const isProduction = environment === 'production';

// Export current environment configuration
export const API_BASE_URL = API_CONFIG[environment].baseURL;
export const API_URL = API_CONFIG[environment].apiURL;

// Environment helpers
export const ENV = {
  isDevelopment,
  isProduction,
  current: environment
};

// Specific API endpoints (with centralized base URL)
export const API_ENDPOINTS = {
  // Core endpoints
  diseases: `${API_URL}/diseases`,
  products: `${API_URL}/products`,
  tips: `${API_URL}/tips`,
  experts: `${API_URL}/experts`,
  questions: `${API_URL}/questions`,
  treatments: `${API_URL}/treatments`,
  notes: `${API_URL}/notes`,
  weatherAlerts: `${API_URL}/weather-alerts`,
  users: `${API_URL}/users`,
  
  // AI/Proxy endpoints
  geminiProxy: `${API_URL}/gemini-proxy`,
  cropAnalysis: `${API_URL}/crop-analysis`,
  detectionResults: `${API_URL}/detection-results`,
  
  // Specific crop analysis endpoints
  cropPredict: `${API_URL}/crop-analysis/predict`,
  diseaseInfo: (disease: string) => `${API_URL}/crop-analysis/disease-info/${encodeURIComponent(disease)}`,
  diseaseMedicines: (disease: string) => `${API_URL}/crop-analysis/disease-medicines?name=${encodeURIComponent(disease)}`,
  
  // Test endpoints
  test: `${API_BASE_URL}/test`,
  geminiTest: `${API_BASE_URL}/gemini`,
  
  // Chat endpoint
  chat: `${API_URL}/chat`
};

// Helper function to create API URLs dynamically
export const createApiUrl = (endpoint: string): string => {
  return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Helper function to create full URLs (non-API)
export const createUrl = (path: string): string => {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

/**
 * Usage Examples:
 * 
 * import { API_ENDPOINTS, API_URL, createApiUrl } from '@/config/api';
 * 
 * // Using predefined endpoints
 * fetch(API_ENDPOINTS.experts)
 * fetch(API_ENDPOINTS.cropPredict)
 * fetch(API_ENDPOINTS.diseaseInfo('rice_blast'))
 * 
 * // Using dynamic URL creation
 * fetch(createApiUrl('/diseases/123'))
 * fetch(createApiUrl('custom-endpoint'))
 * 
 * // Direct API_URL usage
 * fetch(`${API_URL}/custom-endpoint`)
 */

export default {
  API_BASE_URL,
  API_URL,
  API_ENDPOINTS,
  ENV,
  createApiUrl,
  createUrl
};