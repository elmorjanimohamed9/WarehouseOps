import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_TOKEN_KEY = '@auth_token';
export const USER_DATA_KEY = '@user_data';

export const storeAuthData = async (token: string, userData: any) => {
  try {
    await AsyncStorage.multiSet([
      [AUTH_TOKEN_KEY, token],
      [USER_DATA_KEY, JSON.stringify(userData)],
    ]);
    return true;
  } catch (error) {
    console.error('Error storing auth data:', error);
    return false;
  }
};

export const getAuthData = async () => {
  try {
    const [[, token], [, userData]] = await AsyncStorage.multiGet([
      AUTH_TOKEN_KEY,
      USER_DATA_KEY,
    ]);
    return {
      token,
      user: userData ? JSON.parse(userData) : null,
    };
  } catch (error) {
    console.error('Error getting auth data:', error);
    return { token: null, user: null };
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};