import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from './context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

function InitialLayout() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait for the auth state to load before making any routing decisions.
    if (isLoading) {
      return;
    }

    // Check if the user is in a public route (welcome or login).
    // The root route `/` has no segments, so `segments[0]` is undefined.
    const firstSegment = segments[0];
    const isPublicRoute = firstSegment === undefined || firstSegment === 'login';

    if (session && isPublicRoute) {
      // If the user is signed in and tries to access a public screen, redirect to the main dashboard.
      router.replace('/dashboard');
    } else if (!session && !isPublicRoute) {
      // If the user is not signed in and tries to access a protected screen, redirect to the welcome screen.
      router.replace('/');
    }
  }, [session, isLoading, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <InitialLayout />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
