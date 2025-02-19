const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const statisticsApi = {
    getGeneralStatistics: async () => {
      try {
        const response = await fetch(`${API_URL}/statistics`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
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
    },

    getTotalProducts: async () => {
      try {
        const response = await fetch(`${API_URL}/statistics`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.totalProducts || 0;
      } catch (error) {
        console.error('Error fetching total products:', error);
        return 0;
      }
    },

    getOutOfStock: async () => {
      try {
        const response = await fetch(`${API_URL}/statistics`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.outOfStock || 0;
      } catch (error) {
        console.error('Error fetching out of stock products:', error);
        return 0;
      }
    },

    getTotalStockValue: async () => {
      try {
        const response = await fetch(`${API_URL}/statistics`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.totalStockValue || 0;
      } catch (error) {
        console.error('Error fetching total stock value:', error);
        return 0;
      }
    },
  };