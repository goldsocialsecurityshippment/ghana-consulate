// ============================================================
// Smart Finance AI - Auth Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { AuthUser, Profile } from '../types';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';

interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const session = await authService.getSession();
      if (session?.user) {
        const user = { id: session.user.id, email: session.user.email! };
        const profile = await profileService.getProfile(session.user.id).catch(() => null);
        set({ user, profile, isAuthenticated: true });
      }
    } catch (e) {
      console.error('Auth init error:', e);
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password, fullName) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.signUp(email, password, fullName);
      if (data.user) {
        const user = { id: data.user.id, email: data.user.email! };
        set({ user, isAuthenticated: true });
        // Profile created by DB trigger, fetch it
        await get().fetchProfile(data.user.id);
      }
    } catch (e: any) {
      set({ error: e.message ?? 'Sign up failed' });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.signIn(email, password);
      if (data.user) {
        const user = { id: data.user.id, email: data.user.email! };
        set({ user, isAuthenticated: true });
        await get().fetchProfile(data.user.id);
      }
    } catch (e: any) {
      set({ error: e.message ?? 'Sign in failed' });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

 signOut: async () => {
  try {
    await authService.signOut();
  } catch (e) {
    console.error('signOut error:', e);
  }
  set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
},

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(email);
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

 fetchProfile: async (userId) => {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (data) set({ profile: data });
  } catch (e) {
    console.error('Error fetching profile:', e);
  }
},

  updateProfile: async (updates) => {
    const { user, profile } = get();
    if (!user) return;
    try {
      const updated = await profileService.updateProfile(user.id, updates);
      set({ profile: updated });
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
