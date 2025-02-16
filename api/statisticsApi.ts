import { API_URL } from './config';

export const statisticsApi = {
    getGeneralStatistics: async () => {
      try {
        const response = await fetch(`${API_URL}/statistics`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching statistics:', error);
        throw error;
      }
    },
  
    getProductStatistics: async () => {
      try {
        const response = await fetch(`${API_URL}/statistics/products`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching product statistics:', error);
        throw error;
      }
    },
  
    getStockStatistics: async () => {
      try {
        const response = await fetch(`${API_URL}/statistics/stocks`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching stock statistics:', error);
        throw error;
      }
    },
  
    getWarehouseStatistics: async (warehouseId: string) => {
      try {
        const response = await fetch(`${API_URL}/statistics/warehouse/${warehouseId}`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching warehouse statistics:', error);
        throw error;
      }
    },
    
  
    getMostMovedProducts: async (period = '30days') => {
      try {
        const response = await fetch(`${API_URL}/statistics/products/most-moved?period=${period}`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching most moved products:', error);
        throw error;
      }
    },
  
    getValueStatistics: async () => {
      try {
        const response = await fetch(`${API_URL}/statistics/value`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching value statistics:', error);
        throw error;
      }
    }
  };