import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="warehouse-details" options={{ headerShown: false }} />
      <Stack.Screen name="profile-information" options={{ headerShown: false }} />
      <Stack.Screen name="help-support" options={{ headerShown: false }} />
    </Stack>
  );
}