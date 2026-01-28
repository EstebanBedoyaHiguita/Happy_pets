import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';
import type { User, AuthResponse } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isAgent = computed(() => user.value?.role === 'agent');
  const canManageProducts = computed(
    () => user.value?.role === 'admin' || user.value?.role === 'agent'
  );

  function initialize() {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser);
    }
  }

  async function login(email: string, password: string) {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    token.value = response.data.access_token;
    user.value = response.data.user;

    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  }

  async function register(name: string, email: string, password: string, phone?: string) {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
      phone,
    });

    token.value = response.data.access_token;
    user.value = response.data.user;

    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async function fetchProfile() {
    const response = await api.get<User>('/auth/profile');
    user.value = response.data;
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isAgent,
    canManageProducts,
    initialize,
    login,
    register,
    logout,
    fetchProfile,
  };
});
