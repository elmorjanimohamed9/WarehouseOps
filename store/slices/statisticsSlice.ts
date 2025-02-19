import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { statisticsApi } from '@/api/statisticsApi';

export interface GeneralStatistics {
  totalProducts: number;
  outOfStock: number;
  totalStockValue: number;
  mostAddedProducts: any[];
  mostRemovedProducts: any[];
}

export interface StatisticsState {
  general: GeneralStatistics | null;
  product: any | null;
  stock: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  general: null,
  product: null,
  stock: null,
  loading: false,
  error: null,
};

export const fetchGeneralStatistics = createAsyncThunk(
  'statistics/fetchGeneralStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const [totalProducts, outOfStock, totalStockValue] = await Promise.all([
        statisticsApi.getTotalProducts(),
        statisticsApi.getOutOfStock(),
        statisticsApi.getTotalStockValue()
      ]);

      return {
        totalProducts,
        outOfStock,
        totalStockValue,
        mostAddedProducts: [],
        mostRemovedProducts: []
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductStatistics = createAsyncThunk(
  'statistics/fetchProductStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const data = await statisticsApi.getProductStatistics();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStockStatistics = createAsyncThunk(
  'statistics/fetchStockStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const data = await statisticsApi.getStockStatistics();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    resetStatistics: (state) => {
      state.general = null;
      state.product = null;
      state.stock = null;
      state.error = null;
      state.loading = false;
    },
    incrementTotalProducts: (state, action: PayloadAction<number>) => {
      if (state.general) {
        state.general.totalProducts += action.payload;
        state.general.totalStockValue += action.payload;
      }
    },
    updateStockValue: (state, action: PayloadAction<number>) => {
      if (state.general) {
        state.general.totalStockValue += action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneralStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeneralStatistics.fulfilled, (state, action) => {
        state.general = action.payload;
        state.loading = false;
      })
      .addCase(fetchGeneralStatistics.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchProductStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductStatistics.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductStatistics.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchStockStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockStatistics.fulfilled, (state, action) => {
        state.stock = action.payload;
        state.loading = false;
      })
      .addCase(fetchStockStatistics.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { 
  resetStatistics, 
  incrementTotalProducts,
  updateStockValue 
} = statisticsSlice.actions;

export default statisticsSlice.reducer;