const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const warehousemansApi = {
  getAllWarehousemans: async () => {
    try {
      const response = await fetch(`${API_URL}/warehousemans`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching warehousemans:', error);
      throw error;
    }
  },

  getWarehousemanById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/warehousemans/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching warehouseman:', error);
      throw error;
    }
  },

  addWarehouseman: async (warehouseman) => {
    try {
      const response = await fetch(`${API_URL}/warehousemans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(warehouseman),
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding warehouseman:', error);
      throw error;
    }
  },

  updateWarehouseman: async (id: string, updates) => {
    try {
      const response = await fetch(`${API_URL}/warehousemans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating warehouseman:', error);
      throw error;
    }
  },

  deleteWarehouseman: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/warehousemans/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting warehouseman:', error);
      throw error;
    }
  },

  getWarehousemansByWarehouse: async (warehouseId: string) => {
    try {
      const response = await fetch(`${API_URL}/warehousemans/warehouse/${warehouseId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching warehousemans by warehouse:', error);
      throw error;
    }
  }
};