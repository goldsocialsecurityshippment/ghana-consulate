import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, ScrollView, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { useFinanceStore } from '../../state/financeStore';
import { COLORS, CATEGORY_CONFIG, INCOME_TYPE_CONFIG, PAYMENT_METHOD_CONFIG } from '../../constants';
import { formatCurrency, formatDate, getTodayString } from '../../utils';
import { ExpenseCategory, IncomeType, PaymentMethod, CreateExpenseDto, CreateIncomeDto } from '../../types';

type Tab = 'all' | 'income' | 'expense';

export default function TransactionsScreen() {
  const { user, profile } = useAuthStore();
  const { incomes, expenses, isLoading, isRefreshing, loadAll, refreshAll, addIncome, addExpense, deleteIncome, deleteExpense } = useFinanceStore();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'income' | 'expense'>('expense');
  const currency = profile?.currency ?? 'GHS';

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [incomeType, setIncomeType] = useState<IncomeType>('salary');
  const [sourceName, setSourceName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { if (user?.id) loadAll(user.id); }, [user?.id]);
  const onRefresh = useCallback(() => { if (user?.id) refreshAll(user.id); }, [user?.id]);

  const allTransactions = [
    ...incomes.map(i => ({ ...i, txType: 'income' as const })),
    ...expenses.map(e => ({ ...e, txType: 'expense' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = allTransactions.filter(tx => {
    if (activeTab === 'income' && tx.txType !== 'income') return false;
    if (activeTab === 'expense' && tx.txType !== 'expense') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const label = tx.txType === 'income' ? ((tx as any).source_name ?? '').toLowerCase() : CATEGORY_CONFIG[(tx as any).category]?.label.toLowerCase() ?? '';
      if (!label.includes(q) && !(tx.note ?? '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const openAddModal = (type: 'income' | 'expense') => {
    setAddType(type);
    setAmount(''); setNote(''); setDate(getTodayString());
    setCategory('food'); setPaymentMethod('cash');
    setIncomeType('salary'); setSourceName('');
    setShowAddModal(true);
  };

  const handleSave = async () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) { Alert.alert('Invalid Amount', 'Please enter a valid amount.'); return; }
    if (!user?.id) return;
    setIsSaving(true);
    try {
      if (addType === 'income') {
        if (!sourceName.trim()) { Alert.alert('Missing Info', 'Please enter a source name.'); setIsSaving(false); return; }
        await addIncome(user.id, { amount: num, income_type: incomeType, source_name: sourceName.trim(), note: note || undefined, date });
      } else {
        await addExpense(user.id, { amount: num, category, payment_method: paymentMethod, note: note || undefined, date });
      }
      setShowAddModal(false);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (tx: any) => {
    Alert.alert('Delete Transaction', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        if (!user?.id) return;
        if (tx.txType === 'income') await deleteIncome(tx.id, user.id);
        else await deleteExpense(tx.id, user.id);
      }},
    ]);
  };

  const renderTransaction = ({ item: tx }: { item: any }) => {
    const isIncome = tx.txType === 'income';
    const label = isIncome ? tx.source_name : CATEGORY_CONFIG[tx.category as ExpenseCategory]?.label ?? tx.category;
    const iconName = isIncome ? INCOME_TYPE_CONFIG[tx.income_type as IncomeType]?.icon ?? 'cash-outline' : CATEGORY_CONFIG[tx.category as ExpenseCategory]?.icon ?? 'receipt-outline';
    const iconColor = isIncome ? COLORS.success : CATEGORY_CONFIG[tx.category as ExpenseCategory]?.color ?? COLORS.danger;

    return (
      <TouchableOpacity style={styles.txItem} onLongPress={() => handleDelete(tx)} activeOpacity={0.85}>
        <View style={[styles.txIcon, { backgroundColor: iconColor + '15' }]}>
          <Ionicons name={iconName as any} size={19} color={iconColor} />
        </View>
        <View style={styles.txContent}>
          <Text style={styles.txLabel} numberOfLines={1}>{label}</Text>
          {tx.note ? <Text style={styles.txNote} numberOfLines={1}>{tx.note}</Text> : null}
          <Text style={styles.txDate}>{formatDate(tx.date, 'MMM d, yyyy')}</Text>
        </View>
        <View style={styles.txRight}>
          <Text style={[styles.txAmount, { color: isIncome ? COLORS.success : COLORS.danger }]}>
            {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
          </Text>
          {!isIncome && (
            <View style={styles.txPayMethod}>
              <Ionicons name={PAYMENT_METHOD_CONFIG[tx.payment_method as PaymentMethod]?.icon as any} size={11} color={COLORS.dark.textMuted} />
              <Text style={styles.txPayMethodText}>{PAYMENT_METHOD_CONFIG[tx.payment_method as PaymentMethod]?.label}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.addBtn, { borderColor: COLORS.success + '60', backgroundColor: COLORS.success + '12' }]} onPress={() => openAddModal('income')}>
            <Ionicons name="add-outline" size={14} color={COLORS.success} />
            <Text style={[styles.addBtnText, { color: COLORS.success }]}>Income</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.addBtn, { borderColor: COLORS.danger + '60', backgroundColor: COLORS.danger + '12' }]} onPress={() => openAddModal('expense')}>
            <Ionicons name="add-outline" size={14} color={COLORS.danger} />
            <Text style={[styles.addBtnText, { color: COLORS.danger }]}>Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={17} color={COLORS.dark.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={COLORS.dark.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle-outline" size={17} color={COLORS.dark.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {(['all', 'income', 'expense'] as Tab[]).map(tab => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'all' ? 'All' : tab === 'income' ? 'Income' : 'Expenses'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* List */}
      {isLoading && filtered.length === 0 ? (
        <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={40} color={COLORS.dark.textMuted} />
          <Text style={styles.emptyTitle}>No transactions found</Text>
          <Text style={styles.emptySubtitle}>{searchQuery ? 'Try a different search' : 'Add your first transaction'}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        />
      )}

      {/* Add Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{addType === 'income' ? 'Add Income' : 'Add Expense'}</Text>
            <TouchableOpacity onPress={handleSave} disabled={isSaving}>
              {isSaving ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Text style={styles.modalSave}>Save</Text>}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Amount */}
            <View style={styles.amountSection}>
              <Text style={styles.amountCurrency}>{currency === 'GHS' ? '₵' : '$'}</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={COLORS.dark.textMuted}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>

            {addType === 'income' ? (
              <>
                <Text style={styles.fieldLabel}>INCOME TYPE</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                  {(Object.keys(INCOME_TYPE_CONFIG) as IncomeType[]).map(type => (
                    <TouchableOpacity key={type} style={[styles.chip, incomeType === type && { borderColor: INCOME_TYPE_CONFIG[type].color, backgroundColor: INCOME_TYPE_CONFIG[type].color + '15' }]} onPress={() => setIncomeType(type)}>
                      <Ionicons name={INCOME_TYPE_CONFIG[type].icon as any} size={14} color={incomeType === type ? INCOME_TYPE_CONFIG[type].color : COLORS.dark.textSecondary} />
                      <Text style={[styles.chipText, incomeType === type && { color: INCOME_TYPE_CONFIG[type].color }]}>{INCOME_TYPE_CONFIG[type].label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <Text style={styles.fieldLabel}>SOURCE NAME</Text>
                <View style={styles.fieldInputWrapper}>
                  <Ionicons name="business-outline" size={16} color={COLORS.dark.textMuted} />
                  <TextInput style={styles.fieldInput} placeholder="e.g. TechCorp, Client ABC" placeholderTextColor={COLORS.dark.textMuted} value={sourceName} onChangeText={setSourceName} />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.fieldLabel}>CATEGORY</Text>
                <View style={styles.categoryGrid}>
                  {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map(cat => (
                    <TouchableOpacity key={cat} style={[styles.categoryBtn, category === cat && { borderColor: CATEGORY_CONFIG[cat].color, backgroundColor: CATEGORY_CONFIG[cat].color + '15' }]} onPress={() => setCategory(cat)}>
                      <Ionicons name={CATEGORY_CONFIG[cat].icon as any} size={18} color={category === cat ? CATEGORY_CONFIG[cat].color : COLORS.dark.textSecondary} />
                      <Text style={[styles.categoryText, category === cat && { color: CATEGORY_CONFIG[cat].color }]} numberOfLines={1}>{CATEGORY_CONFIG[cat].label.split(' ')[0]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.fieldLabel}>PAYMENT METHOD</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                  {(Object.keys(PAYMENT_METHOD_CONFIG) as PaymentMethod[]).map(method => (
                    <TouchableOpacity key={method} style={[styles.chip, paymentMethod === method && { borderColor: PAYMENT_METHOD_CONFIG[method].color, backgroundColor: PAYMENT_METHOD_CONFIG[method].color + '15' }]} onPress={() => setPaymentMethod(method)}>
                      <Ionicons name={PAYMENT_METHOD_CONFIG[method].icon as any} size={14} color={paymentMethod === method ? PAYMENT_METHOD_CONFIG[method].color : COLORS.dark.textSecondary} />
                      <Text style={[styles.chipText, paymentMethod === method && { color: PAYMENT_METHOD_CONFIG[method].color }]}>{PAYMENT_METHOD_CONFIG[method].label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <Text style={styles.fieldLabel}>NOTE (OPTIONAL)</Text>
            <View style={styles.fieldInputWrapper}>
              <Ionicons name="create-outline" size={16} color={COLORS.dark.textMuted} />
              <TextInput style={[styles.fieldInput, { height: 70, textAlignVertical: 'top' }]} placeholder="Add a note..." placeholderTextColor={COLORS.dark.textMuted} value={note} onChangeText={setNote} multiline />
            </View>

            <Text style={styles.fieldLabel}>DATE</Text>
            <View style={styles.fieldInputWrapper}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.dark.textMuted} />
              <TextInput style={styles.fieldInput} placeholder="YYYY-MM-DD" placeholderTextColor={COLORS.dark.textMuted} value={date} onChangeText={setDate} />
            </View>
            <View style={{ height: 60 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark.bg },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 0, backgroundColor: COLORS.dark.bg },
  headerTitle: { fontSize: 26, fontWeight: '700', color: COLORS.dark.text, marginBottom: 16, letterSpacing: -0.5 },
  headerActions: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  addBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10, borderRadius: 11, borderWidth: 1 },
  addBtnText: { fontSize: 13, fontWeight: '700' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.dark.card, borderRadius: 13, paddingHorizontal: 14, marginBottom: 14, borderWidth: 1, borderColor: COLORS.dark.border },
  searchInput: { flex: 1, paddingVertical: 13, fontSize: 14, color: COLORS.dark.text },
  tabsRow: { flexDirection: 'row', backgroundColor: COLORS.dark.surface, borderRadius: 11, padding: 3, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 9 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.dark.textSecondary, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  listContent: { padding: 24, paddingTop: 8 },
  txItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.dark.card, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.dark.border },
  txIcon: { width: 42, height: 42, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txContent: { flex: 1 },
  txLabel: { fontSize: 14, fontWeight: '600', color: COLORS.dark.text },
  txNote: { fontSize: 12, color: COLORS.dark.textSecondary, marginTop: 2 },
  txDate: { fontSize: 11, color: COLORS.dark.textMuted, marginTop: 2 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 14, fontWeight: '700' },
  txPayMethod: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  txPayMethodText: { fontSize: 11, color: COLORS.dark.textMuted },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.dark.text },
  emptySubtitle: { fontSize: 13, color: COLORS.dark.textSecondary },
  modalContainer: { flex: 1, backgroundColor: COLORS.dark.bg },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: COLORS.dark.border },
  modalCancel: { fontSize: 15, color: COLORS.dark.textSecondary },
  modalTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dark.text },
  modalSave: { fontSize: 15, color: COLORS.primary, fontWeight: '700' },
  modalBody: { flex: 1, paddingHorizontal: 24 },
  amountSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 36 },
  amountCurrency: { fontSize: 28, color: COLORS.dark.textSecondary, fontWeight: '600', marginRight: 4 },
  amountInput: { fontSize: 52, fontWeight: '700', color: COLORS.dark.text, minWidth: 120, textAlign: 'center', letterSpacing: -2 },
  fieldLabel: { fontSize: 11, fontWeight: '600', color: COLORS.dark.textMuted, letterSpacing: 1.2, marginBottom: 10, marginTop: 22 },
  fieldInputWrapper: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.dark.card, borderRadius: 13, paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.dark.border },
  fieldInput: { flex: 1, paddingVertical: 13, fontSize: 15, color: COLORS.dark.text },
  chipRow: { marginBottom: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.dark.card, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, marginRight: 8, borderWidth: 1, borderColor: COLORS.dark.border },
  chipText: { fontSize: 13, color: COLORS.dark.textSecondary, fontWeight: '600' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryBtn: { width: '22%', alignItems: 'center', paddingVertical: 12, backgroundColor: COLORS.dark.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.dark.border, gap: 6 },
  categoryText: { fontSize: 10, color: COLORS.dark.textSecondary, fontWeight: '600' },
});
