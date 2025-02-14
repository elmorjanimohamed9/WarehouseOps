import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from '@/api/productsApi';
import { Product } from '@/types/product';

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    return await productsApi.getAllProducts();
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string) => {
    return await productsApi.getProductById(id);
  }
);

export const addNewProduct = createAsyncThunk(
  'products/add',
  async (product: Partial<Product>) => {
    return await productsApi.addProduct(product);
  }
);

export const updateExistingProduct = createAsyncThunk(
  'products/update',
  async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
    return await productsApi.updateProduct(id, updates);
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Fetch single product
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      // Add new product
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update product
      .addCase(updateExistingProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      });
  },
});

export const { clearSelectedProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;