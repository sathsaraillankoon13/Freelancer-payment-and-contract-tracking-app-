import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { AppProvider } from '@/context/AppContext';
import { GlobalModals } from '@/components/navigation/GlobalModals';

// Silence non-critical warning toasts in dev environment
LogBox.ignoreAllLogs(true);

// Prevent native splash screen from auto-hiding before asset readiness
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fallbackReady, setFallbackReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const isReady = Boolean(fontsLoaded || fontError || fallbackReady);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  useEffect(() => {
    // Safety fallback so splash never hangs indefinitely
    const timer = setTimeout(() => {
      setFallbackReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="auth/account-type" />
          <Stack.Screen name="auth/forgot-password" />
          <Stack.Screen name="auth/email-verification" />
          <Stack.Screen name="home" />
          <Stack.Screen name="tasks" />
          <Stack.Screen name="scope" />
          <Stack.Screen name="contract-terms" />
          <Stack.Screen name="contract-preview" />
          <Stack.Screen name="contract-review" />
          <Stack.Screen name="clients" />
          <Stack.Screen name="rubrics" />
          <Stack.Screen name="projects" />
          <Stack.Screen name="finance" />
          <Stack.Screen name="messages" />
          <Stack.Screen name="more" />
        </Stack>
        <GlobalModals />
      </AppProvider>
    </SafeAreaProvider>
  );
}
