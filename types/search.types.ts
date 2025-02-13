export interface Product {
    id: number;
    name: string;
    type: string;
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
      };
    }>;
  }
  
  export interface SortOption {
    id: string;
    label: string;
    icon: any;
  }