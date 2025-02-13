export interface Statistics {
    totalProducts: number;
    outOfStock: number;
    totalStockValue: number;
    mostAddedProducts: any[];
    mostRemovedProducts: any[];
  }
  
  export interface Product {
    id: number;
    name: string;
    type: string;
    barcode: string;
    price: number;
    solde?: number;
    supplier: string;
    image: string;
    stocks: Array<{
      id: number;
      name: string;
      quantity: number;
      localisation: {
        city: string;
        latitude: number;
        longitude: number;
      }
    }>;
    editedBy: Array<{
      warehousemanId: number;
      at: string;
    }>;
  }