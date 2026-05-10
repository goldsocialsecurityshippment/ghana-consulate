# 📱 Smart Finance AI — Complete Setup Guide

> Production-ready personal finance mobile app built with React Native (Expo) + Supabase

---

## 🏗️ Architecture Overview

```
smart-finance-ai/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout (auth listener)
│   ├── index.tsx                 # Auth guard redirect
│   ├── auth/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   └── (tabs)/
│       ├── _layout.tsx           # Bottom tab navigator
│       ├── dashboard.tsx
│       ├── transactions.tsx
│       ├── budget.tsx
│       ├── savings.tsx
│       ├── analytics.tsx
│       ├── notifications.tsx
│       └── profile.tsx
├── src/
│   ├── types/index.ts            # All TypeScript types
│   ├── constants/index.ts        # Colors, categories, config
│   ├── services/
│   │   ├── supabase.ts           # Supabase client
│   │   ├── authService.ts        # Authentication
│   │   ├── profileService.ts     # User profiles
│   │   ├── incomeService.ts      # Income CRUD
│   │   ├── expenseService.ts     # Expense CRUD + analytics
│   │   ├── budgetService.ts      # Budget management
│   │   ├── savingsService.ts     # Savings goals
│   │   ├── notificationService.ts # Push + DB notifications
│   │   ├── budgetEngine.ts       # Real financial calculations
│   │   └── insightsEngine.ts     # AI insights generator
│   ├── state/
│   │   ├── authStore.ts          # Zustand auth state
│   │   └── financeStore.ts       # Zustand financial state
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   └── main/
│   │       ├── DashboardScreen.tsx
│   │       ├── TransactionsScreen.tsx
│   │       ├── BudgetScreen.tsx
│   │       ├── SavingsScreen.tsx
│   │       ├── AnalyticsScreen.tsx
│   │       ├── NotificationsScreen.tsx
│   │       └── ProfileScreen.tsx
│   └── utils/index.ts
└── database/
    └── schema.sql                # Complete PostgreSQL schema
```

---

## 🚀 Step-by-Step Setup

### STEP 1: Prerequisites

Install these before starting:

```bash
# Node.js 18+ (check with node --version)
# Install Expo CLI
npm install -g expo-cli eas-cli

# Install iOS Simulator (Mac only) via Xcode
# OR use Expo Go app on your physical phone
```

---

### STEP 2: Clone & Install

```bash
# Navigate to the project
cd smart-finance-ai

# Install all dependencies
npm install

# If you get peer dependency errors:
npm install --legacy-peer-deps
```

---

### STEP 3: Supabase Project Setup

1. Go to **https://supabase.com** → Create a new project
2. Choose a region close to your users (e.g., **eu-west-1** for West Africa)
3. Set a strong database password and save it
4. Wait for project to initialize (~2 minutes)

**Get your credentials:**
- Go to **Settings → API**
- Copy:
  - `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
  - `anon public key` → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

### STEP 4: Run Database Schema

1. In Supabase dashboard → **SQL Editor → New Query**
2. Paste the entire contents of `database/schema.sql`
3. Click **Run**
4. Verify tables in **Table Editor**: you should see:
   - `profiles`
   - `incomes`
   - `expenses`
   - `budgets`
   - `savings_goals`
   - `notifications`

---

### STEP 5: Configure Auth Settings

In Supabase → **Authentication → Settings**:

```
Site URL: exp://localhost:8081
Redirect URLs (add these):
  - exp://localhost:8081/--/
  - smartfinanceai://
  - smartfinanceai://reset-password
```

Enable **Email Confirmations** (recommended for production) or disable for development.

---

### STEP 6: Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and fill in your values:
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_DEFAULT_CURRENCY=GHS
```

---

### STEP 7: Run the App

```bash
# Start development server
npx expo start

# Press 'a' for Android emulator
# Press 'i' for iOS simulator (Mac only)
# Press 's' to send link to Expo Go on your phone
# Scan QR code with Expo Go (Android) or Camera app (iOS)
```

---

### STEP 8: EAS Build (Production APK/IPA)

```bash
# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for Android (APK)
eas build --platform android --profile preview

# Build for iOS (requires Apple Developer account)
eas build --platform ios --profile preview
```

---

## 🔧 Configuration Options

### Supported Currencies
The app supports: GHS, USD, EUR, GBP, NGN, KES, ZAR
Change default in `.env`: `EXPO_PUBLIC_DEFAULT_CURRENCY=GHS`

### Budget Defaults (50/30/20 rule)
- **50%** Needs (food, rent, transport, bills)
- **30%** Wants (entertainment, shopping, subscriptions)
- **20%** Savings (locked savings, investments)

Adjustable per-user in the Budget screen.

### Alert Threshold
Default: **80%** — notifications fire when you've used 80% of any budget category.
Adjustable per-user in Budget → Edit.

---

## 🔔 Push Notifications

Notifications are automatically scheduled:
- **Weekly financial report** — Every Monday at 9:00 AM
- **Income reminder** — Every Saturday at 6:00 PM
- **Budget alerts** — Triggered when category spending hits threshold
- **Low balance alerts** — Triggered when spendable balance is low

For production push notifications, set up an **EAS project**:
```bash
eas build:configure
# Add your EAS project ID to app.json extra.eas.projectId
```

---

## 🗄️ Database Details

### Row Level Security (RLS)
All tables have RLS enabled. Users can only access their own data.

### Auto-created on signup
When a user registers, a database trigger automatically:
1. Creates their `profiles` row
2. Creates their `budgets` row with 50/30/20 defaults

### Indexes
Optimized indexes on user_id + date for fast queries across all tables.

---

## 🤖 AI Insights Engine

The insights engine (`src/services/insightsEngine.ts`) generates smart insights from real data:

| Insight Type | Trigger |
|---|---|
| Income up/down | >10% change vs last month |
| High spending rate | >90% of income spent |
| Good spending control | <60% of income spent |
| Category overspending | >25% increase vs last month |
| Weekend spending spike | Weekend > 50% of monthly spend |
| Goal almost reached | Savings goal >75% complete |
| No income recorded | 0 income entries this month |

---

## 💰 Budget Engine Logic

Real calculations from `src/services/budgetEngine.ts`:

```
Total Balance     = Total Income - Total Expenses
Spendable Balance = Total Balance - Locked Savings
Safe Daily Budget = Spendable Balance / Days Remaining in Month

Needs Allocation  = Total Income × needs_percentage%
Wants Allocation  = Total Income × wants_percentage%
Savings Allocation = Total Income × savings_percentage%

Spending % = (Total Expenses / Total Income) × 100
```

---

## 🔒 Savings Lock System

- All savings goals are **locked by default**
- Locked savings are **excluded** from spendable balance
- Unlocking requires explicit user confirmation via alert dialog
- Prevents accidental overspending

---

## 📊 Analytics Features

| Chart | Data Source |
|---|---|
| Income vs Expenses (6 months) | Real DB query per month |
| Monthly Savings trend | Calculated: income - expenses |
| Category breakdown | Grouped expense queries |
| Income by type | Grouped income queries |
| Day of week spending | Last 3 months of expenses |
| Savings rate % | Live calculation |

---

## 🚨 Troubleshooting

### "Invalid API key" error
→ Check `.env` file has correct Supabase credentials with no extra spaces

### "Row not found" on profile
→ Database trigger may have failed. Manually insert:
```sql
INSERT INTO profiles (id, email) VALUES ('your-user-id', 'your@email.com');
INSERT INTO budgets (user_id) VALUES ('your-user-id');
```

### Push notifications not working
→ Must test on physical device (not simulator)
→ Must have Expo EAS project configured

### "Module not found" errors
```bash
npx expo install
# or
npm install --legacy-peer-deps
```

### Expo Router errors
```bash
npx expo start --clear
```

---

## 🔥 Future Features (Architecture Ready)

The codebase is prepared for:
- **Bank Sync** — Add bank API integration to `incomeService.ts`
- **MoMo Integration** — MTN/Vodafone MoMo webhook in `incomeService.ts`
- **OCR Receipt Scanning** — Add `expo-camera` + OCR service
- **AI Assistant** — Anthropic Claude API in `insightsEngine.ts`
- **Multi-currency** — Currency conversion via exchange rate API
- **Family Budgets** — Add `family_id` to schema + shared RLS policies
- **Data Export** — CSV export from Supabase data

---

## 📞 Support

- Email: support@smartfinanceai.com
- Supabase Docs: https://supabase.com/docs
- Expo Docs: https://docs.expo.dev
- React Navigation: https://reactnavigation.org

---

*Built with ❤️ for real users who want real financial control.*
