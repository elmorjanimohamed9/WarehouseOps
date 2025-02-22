export interface Statistics {
    totalProducts: number;
    outOfStock: number;
    totalStockValue: number;
    mostAddedProducts: any[];
    mostRemovedProducts: any[];
  }

  export interface Stock {
    id: number;
    name: string;
    quantity: number;
    localisation: {
      city: string;
      latitude: number;
      longitude: number;
    };
  }
  
  export interface Product {
    id: string;
    name: string;
    type: string;
    barcode: string;
    price: number;
    solde?: number;
    supplier: string;
    image: string;
    stocks: Stock[]; 
    editedBy: Array<{
      warehousemanId: number;
      at: string;
    }>;
  }