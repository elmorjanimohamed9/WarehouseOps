import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchGeneralStatistics,
  fetchProductStatistics,
  fetchStockStatistics,
  incrementTotalProducts,
  decrementTotalProducts,
  updateOutOfStock,
  updateStockValue,
  resetStatistics
} from '@/store/slices/statisticsSlice';
import { AppDispatch, RootState } from '@/store/store';

export const useStatistics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { general, product, stock, loading, error } = useSelector(
    (state: RootState) => state.statistics
  );

  const loadGeneralStatistics = useCallback(async () => {
    try {
      await dispatch(fetchGeneralStatistics()).unwrap();
    } catch (error) {
      console.error('Error loading general statistics:', error);
    }
  }, [dispatch]);

  const loadProductStatistics = useCallback(async () => {
    try {
      await dispatch(fetchProductStatistics()).unwrap();
    } catch (error) {
      console.error('Error loading product statistics:', error);
    }
  }, [dispatch]);

  const loadStockStatistics = useCallback(async () => {
    try {
      await dispatch(fetchStockStatistics()).unwrap();
    } catch (error) {
      console.error('Error loading stock statistics:', error);
    }
  }, [dispatch]);

  const updateTotalProducts = useCallback((amount: number, isIncrement: boolean = true) => {
    dispatch(isIncrement ? incrementTotalProducts(amount) : decrementTotalProducts(amount));
  }, [dispatch]);

  const setOutOfStockCount = useCallback((count: number) => {
    dispatch(updateOutOfStock(count));
  }, [dispatch]);

  const setTotalStockValue = useCallback((value: number) => {
    dispatch(updateStockValue(value));
  }, [dispatch]);

  const refreshAllStatistics = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(fetchGeneralStatistics()).unwrap(),
        dispatch(fetchProductStatistics()).unwrap(),
        dispatch(fetchStockStatistics()).unwrap()
      ]);
    } catch (error) {
      console.error('Error refreshing statistics:', error);
    }
  }, [dispatch]);

  const clearStatistics = useCallback(() => {
    dispatch(resetStatistics());
  }, [dispatch]);

  return {
    // State
    general,
    product,
    stock,
    loading,
    error,

    // Loading functions
    loadGeneralStatistics,
    loadProductStatistics,
    loadStockStatistics,
    refreshAllStatistics,

    // Update functions
    updateTotalProducts,
    setOutOfStockCount,
    setTotalStockValue,
    clearStatistics,

    // Computed values
    totalProducts: general?.totalProducts || 0,
    outOfStock: general?.outOfStock || 0,
    totalStockValue: general?.totalStockValue || 0,
    categoryDistribution: general?.categoryDistribution || {},
    stockHistory: general?.stockHistory || { labels: [], data: [] },
    valueHistory: general?.valueHistory || { labels: [], data: [] },
    mostAddedProducts: general?.mostAddedProducts || [],
    mostRemovedProducts: general?.mostRemovedProducts || []
  };
};