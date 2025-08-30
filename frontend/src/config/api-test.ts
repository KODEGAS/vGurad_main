/**
 * API Configuration Test
 * 
 * Simple test to verify the API configuration is working correctly
 */

import { API_BASE_URL, API_URL, API_ENDPOINTS, ENV } from './api';

// Console log test
console.log('=== API Configuration Test ===');
console.log('Environment:', ENV.current);
console.log('Is Development:', ENV.isDevelopment);
console.log('Is Production:', ENV.isProduction);
console.log('API Base URL:', API_BASE_URL);
console.log('API URL:', API_URL);
console.log('');
console.log('Sample Endpoints:');
console.log('- Experts:', API_ENDPOINTS.experts);
console.log('- Crop Predict:', API_ENDPOINTS.cropPredict);
console.log('- Disease Info (test):', API_ENDPOINTS.diseaseInfo('test_disease'));
console.log('- Test Endpoint:', API_ENDPOINTS.test);
console.log('');

// Export for use in other files
export const testApiConfig = () => {
  return {
    environment: ENV.current,
    baseUrl: API_BASE_URL,
    apiUrl: API_URL,
    sampleEndpoints: {
      experts: API_ENDPOINTS.experts,
      cropPredict: API_ENDPOINTS.cropPredict,
      test: API_ENDPOINTS.test
    }
  };
};

export default testApiConfig;