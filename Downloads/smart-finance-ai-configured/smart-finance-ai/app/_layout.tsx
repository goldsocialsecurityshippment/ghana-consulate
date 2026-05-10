// ============================================================
// Smart Finance AI - Root Layout
// Expo Router with auth state management
// ============================================================

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../src/state/authStore';
import { notificationService } from '../src/services/notificationService';
import { supabase } from '../src/services/supabase';

export default function RootLayout() {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    // Initialize auth state
    initialize();

    // Register for push notifications
    notificationService.registerForPushNotifications().catch(() => {});
    notificationService.scheduleWeeklyReport().catch(() => {});
    notificationService.scheduleIncomeReminder().catch(() => {});

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          initialize();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#0A0A0F" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth/forgot-password" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
