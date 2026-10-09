import React, { useEffect } from 'react';
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

// Hide native splash screen immediately so the app's designed branded loading screen displays without delay
SplashScreen.hideAsync().catch(() => {});

export default function RootLayout() {
  useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

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
