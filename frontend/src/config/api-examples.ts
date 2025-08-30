/**
 * API Configuration Usage Examples
 * 
 * This file demonstrates how to use the centralized API configuration
 * in different scenarios within the vGuard application.
 */

import { API_ENDPOINTS, API_URL, API_BASE_URL, ENV, createApiUrl } from './api';

// Example 1: Using predefined endpoints
export const fetchExperts = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.experts);
    return await response.json();
  } catch (error) {
    console.error('Error fetching experts:', error);
    throw error;
  }
};

// Example 2: Using crop analysis endpoints with parameters
export const fetchDiseaseInfo = async (diseaseName: string) => {
  try {
    const response = await fetch(API_ENDPOINTS.diseaseInfo(diseaseName));
    return await response.json();
  } catch (error) {
    console.error('Error fetching disease info:', error);
    throw error;
  }
};

// Example 3: Using dynamic URL creation
export const fetchCustomEndpoint = async (endpoint: string) => {
  try {
    const response = await fetch(createApiUrl(endpoint));
    return await response.json();
  } catch (error) {
    console.error('Error fetching custom endpoint:', error);
    throw error;
  }
};

// Example 4: Direct API_URL usage for custom endpoints
export const submitQuestion = async (questionData: any) => {
  try {
    const response = await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting question:', error);
    throw error;
  }
};

// Example 5: Environment-aware API calls
export const performHealthCheck = async () => {
  if (ENV.isDevelopment) {
    console.log('Running in development mode');
    console.log('API Base URL:', API_BASE_URL);
  }
  
  try {
    const response = await fetch(API_ENDPOINTS.test);
    const result = await response.text();
    console.log('Health check result:', result);
    return result;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// Example 6: Axios usage with centralized config
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const fetchTipsWithAxios = async () => {
  try {
    const response = await axiosInstance.get('/tips');
    return response.data;
  } catch (error) {
    console.error('Error fetching tips with axios:', error);
    throw error;
  }
};

/**
 * Migration Examples
 * 
 * These examples show how to migrate from hardcoded URLs to centralized config
 */

// ❌ Old approach (hardcoded)
// const response = await fetch('https://vgurad-backend.onrender.com/api/experts');

// ✅ New approach (centralized)
// const response = await fetch(API_ENDPOINTS.experts);

// ❌ Old approach (hardcoded with manual encoding)
// const diseaseUrl = `https://vgurad-backend.onrender.com/api/crop-analysis/disease-info/${encodeURIComponent(diseaseName)}`;

// ✅ New approach (centralized with helper function)
// const diseaseUrl = API_ENDPOINTS.diseaseInfo(diseaseName);

export default {
  fetchExperts,
  fetchDiseaseInfo,
  fetchCustomEndpoint,
  submitQuestion,
  performHealthCheck,
  axiosInstance,
  fetchTipsWithAxios
};