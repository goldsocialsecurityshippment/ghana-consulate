import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { useFinanceStore } from '../../state/financeStore';
import { COLORS, NOTIFICATION_ICONS } from '../../constants';
import { formatRelativeTime } from '../../utils';
import { AppNotification } from '../../types';

const NOTIF_COLORS: Record<string, string> = {
  overspending: COLORS.danger,
  low_balance: COLORS.warning,
  savings_protection: COLORS.primary,
  weekly_report: COLORS.info,
  income_reminder: COLORS.success,
  goal_progress: '#C45FEF',
  system: COLORS.dark.textSecondary,
};

export default function NotificationsScreen() {
  const { user } = useAuthStore();
  const { notifications, unreadCount, isRefreshing, isLoading, loadNotifications, markNotificationRead, markAllNotificationsRead } = useFinanceStore();

  useEffect(() => { if (user?.id) loadNotifications(user.id); }, [user?.id]);

  const handleMarkRead = async (n: AppNotification) => {
    if (n.read_status) return;
    await markNotificationRead(n.id);
  };

  const handleMarkAll = () => {
    if (!user?.id || unreadCount === 0) return;
    Alert.alert('Mark All Read', 'Mark all notifications as read?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Mark All', onPress: () => markAllNotificationsRead(user.id) },
    ]);
  };

  const renderItem = ({ item }: { item: AppNotification }) => {
    const color = NOTIF_COLORS[item.type] ?? COLORS.primary;
    const icon = NOTIFICATION_ICONS[item.type] ?? 'information-circle-outline';
    return (
      <TouchableOpacity style={[styles.card, !item.read_status && styles.cardUnread]} onPress={() => handleMarkRead(item)} activeOpacity={0.85}>
        <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.cardTime}>{formatRelativeTime(item.created_at)}</Text>
          </View>
          <Text style={styles.cardMessage} numberOfLines={2}>{item.message}</Text>
          <View style={[styles.typeBadge, { backgroundColor: color + '15' }]}>
            <Text style={[styles.typeBadgeText, { color }]}>{item.type.replace(/_/g, ' ').toUpperCase()}</Text>
          </View>
        </View>
        {!item.read_status && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadgeRow}>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
              </View>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAll}>
            <Ionicons name="checkmark-done-outline" size={15} color={COLORS.primary} />
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading && notifications.length === 0 ? (
        <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View>
      ) : notifications.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIcon}><Ionicons name="notifications-off-outline" size={30} color={COLORS.dark.textMuted} /></View>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptySubtitle}>Financial alerts and insights will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => user?.id && loadNotifications(user.id)} tintColor={COLORS.primary} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: COLORS.dark.text, letterSpacing: -0.5 },
  unreadBadgeRow: { marginTop: 6 },
  unreadBadge: { backgroundColor: COLORS.primary + '20', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  unreadBadgeText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.primary + '15', borderRadius: 11, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.primary + '30' },
  markAllText: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },
  listContent: { padding: 24, paddingTop: 8 },
  card: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.dark.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: COLORS.dark.border, gap: 12, position: 'relative' },
  cardUnread: { borderColor: COLORS.primary + '30', backgroundColor: COLORS.primary + '06' },
  iconBox: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.dark.text, flex: 1, marginRight: 8 },
  cardTime: { fontSize: 11, color: COLORS.dark.textMuted, flexShrink: 0 },
  cardMessage: { fontSize: 13, color: COLORS.dark.textSecondary, lineHeight: 18, marginBottom: 8 },
  typeBadge: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  typeBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  unreadDot: { position: 'absolute', top: 16, right: 14, width: 7, height: 7, borderRadius: 3.5 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: COLORS.dark.card, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dark.text },
  emptySubtitle: { fontSize: 13, color: COLORS.dark.textSecondary, textAlign: 'center', paddingHorizontal: 40 },
});
