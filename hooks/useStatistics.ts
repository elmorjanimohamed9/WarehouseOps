import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchGeneralStatistics,
  fetchProductStatistics,
  fetchStockStatistics,
} from '@/store/slices/statisticsSlice';
import { AppDispatch, RootState } from '@/store/store';

export const useStatistics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { general, product, stock, loading, error } = useSelector(
    (state: RootState) => state.statistics
  );

  const loadGeneralStatistics = useCallback(() => {
    dispatch(fetchGeneralStatistics());
  }, [dispatch]);

  const loadProductStatistics = useCallback(() => {
    dispatch(fetchProductStatistics());
  }, [dispatch]);

  const loadStockStatistics = useCallback(() => {
    dispatch(fetchStockStatistics());
  }, [dispatch]);

  return {
    general,
    product,
    stock,
    loading,
    error,
    loadGeneralStatistics,
    loadProductStatistics,
    loadStockStatistics,
  };
};
