// ============================================================
// Smart Finance AI - Notification Service
// ============================================================

import { supabase } from './supabase';
import * as ExpoNotifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { AppNotification, NotificationType } from '../types';

// Configure notification handler
ExpoNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  /**
   * Register for push notifications and return token
   */
  registerForPushNotifications: async (): Promise<string | null> => {
    if (!Device.isDevice) return null;

    const { status: existingStatus } = await ExpoNotifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return null;

    if (Platform.OS === 'android') {
      await ExpoNotifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: ExpoNotifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6C63FF',
      });
    }

    const tokenData = await ExpoNotifications.getExpoPushTokenAsync();
    return tokenData.data;
  },

  /**
   * Send a local push notification
   */
  sendLocalNotification: async (title: string, body: string, data?: Record<string, unknown>) => {
    await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data ?? {},
        sound: true,
      },
      trigger: null, // immediate
    });
  },

  /**
   * Schedule a weekly report notification
   */
  scheduleWeeklyReport: async () => {
    await ExpoNotifications.cancelAllScheduledNotificationsAsync();
    await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: '📊 Weekly Financial Report',
        body: "Check your spending summary for this week.",
        sound: true,
      },
      trigger: {
        weekday: 1, // Monday
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  },

  /**
   * Schedule income reminder
   */
  scheduleIncomeReminder: async () => {
    await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: '💰 Income Reminder',
        body: "Don't forget to record any payments you received.",
        sound: true,
      },
      trigger: {
        weekday: 6, // Saturday
        hour: 18,
        minute: 0,
        repeats: true,
      },
    });
  },

  // --- Database Notifications ---

  /**
   * Get all notifications for user
   */
  getAll: async (userId: string): Promise<AppNotification[]> => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Get unread count
   */
  getUnreadCount: async (userId: string): Promise<number> => {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read_status', false);
    if (error) throw error;
    return count ?? 0;
  },

  /**
   * Create a notification in database
   */
  create: async (
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<AppNotification> => {
    const { data, error } = await supabase
      .from('notifications')
      .insert({ user_id: userId, type, title, message, metadata: metadata ?? {} })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Mark notification as read
   */
  markRead: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .update({ read_status: true })
      .eq('id', id);
    if (error) throw error;
  },

  /**
   * Mark all as read
   */
  markAllRead: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .update({ read_status: true })
      .eq('user_id', userId)
      .eq('read_status', false);
    if (error) throw error;
  },

  /**
   * Delete notification
   */
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) throw error;
  },

  /**
   * Send overspending alert (local + db)
   */
  sendOverspendingAlert: async (
    userId: string,
    category: string,
    percentage: number
  ): Promise<void> => {
    const title = '⚠️ Budget Alert';
    const message = `You have used ${Math.round(percentage)}% of your ${category} budget.`;
    await Promise.all([
      notificationService.sendLocalNotification(title, message),
      notificationService.create(userId, 'overspending', title, message, { category, percentage }),
    ]);
  },

  /**
   * Send low balance alert
   */
  sendLowBalanceAlert: async (userId: string, balance: number, currency: string): Promise<void> => {
    const title = '🔴 Low Safe-to-Spend Balance';
    const message = `Your spendable balance is ${currency}${balance.toFixed(2)}. Spend wisely!`;
    await Promise.all([
      notificationService.sendLocalNotification(title, message),
      notificationService.create(userId, 'low_balance', title, message, { balance }),
    ]);
  },

  /**
   * Send savings goal progress alert
   */
  sendGoalProgressAlert: async (
    userId: string,
    goalName: string,
    percentage: number
  ): Promise<void> => {
    const title = '🎯 Savings Goal Progress';
    const message = `You are ${Math.round(percentage)}% closer to your "${goalName}" goal!`;
    await Promise.all([
      notificationService.sendLocalNotification(title, message),
      notificationService.create(userId, 'goal_progress', title, message, { goalName, percentage }),
    ]);
  },

  /**
   * Get badge count and set it
   */
  setBadgeCount: async (count: number): Promise<void> => {
    await ExpoNotifications.setBadgeCountAsync(count);
  },
};
