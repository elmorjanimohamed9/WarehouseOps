import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { clearAuthData } from '@/utils/auth';
import { router } from 'expo-router';

interface Warehouseman {
  id: string;
  image: string;
  name: string;
  dob: string;
  city: string;
  secretKey: string;
  warehouseId: number;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = async () => {
    await clearAuthData();
    dispatch(logout());
    router.replace('/login');
  };

  return {
    user: user as Warehouseman,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout,
  };
};