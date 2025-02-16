import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchProducts,
  fetchProductById,
  addNewProduct,
  updateExistingProduct,
  clearSelectedProduct,
  clearError,
} from '@/store/slices/productsSlice';
import { Product } from '@/types/product';

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items,
    selectedProduct,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return {
    products: items,
    selectedProduct,
    loading,
    error,
    refreshProducts: () => dispatch(fetchProducts()),
    getProduct: (id: string) => dispatch(fetchProductById(id)).unwrap(),
    addProduct: (product: Partial<Product>) => dispatch(addNewProduct(product)),
    updateProduct: (id: string, updates: Partial<Product>) => 
      dispatch(updateExistingProduct({ id, updates })).unwrap(),
    clearProduct: () => dispatch(clearSelectedProduct()),
    clearError: () => dispatch(clearError()),
  };
};