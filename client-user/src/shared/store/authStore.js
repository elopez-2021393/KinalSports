// src/shared/store/authStore.js

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'refreshToken';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: async (accessToken, user, refreshToken) => {
        try {
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
          set({
            token: accessToken,
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error al guardar refresh token:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('Error al eliminar refresh token:', error);
          throw error;
        }
      },

      setAccessToken: (accessToken) => {
        set({ token: accessToken });
      },

      updateUser: (userData) => {
        set({ user: userData });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          // AsyncStorage no se usa para persistencia, solo para Zustand
          return null;
        },
        setItem: (name, value) => {
          // No-op, usamos SecureStore para refresh token
        },
        removeItem: (name) => {
          // No-op
        },
      })),
      onRehydrateStorage: () => (state) => {
        state._hasHydrated = true;
      },
    }
  )
);
