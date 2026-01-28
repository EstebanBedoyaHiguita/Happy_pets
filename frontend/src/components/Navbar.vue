<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const authStore = useAuthStore();
const cartStore = useCartStore();
const isMobileMenuOpen = ref(false);

const navLinks = [
  { name: 'Inicio', to: '/' },
  { name: 'Tienda', to: '/tienda' },
  { name: 'Nosotros', to: '/nosotros' },
  { name: 'Blog', to: '/blog' },
];
</script>

<template>
  <nav class="bg-primary shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center space-x-2">
            <span class="text-2xl">🐾</span>
            <span class="text-xl font-bold text-white">Happy Pets</span>
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-gray-300 hover:text-secondary transition-colors duration-200 font-medium"
            active-class="text-secondary"
          >
            {{ link.name }}
          </RouterLink>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <!-- Cart button -->
          <button
            @click="cartStore.toggleCart"
            class="relative text-gray-300 hover:text-secondary transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-2 bg-secondary text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </button>

          <!-- Auth buttons -->
          <div v-if="!authStore.isAuthenticated" class="hidden md:flex items-center space-x-3">
            <RouterLink
              to="/login"
              class="text-gray-300 hover:text-secondary transition-colors font-medium"
            >
              Iniciar sesion
            </RouterLink>
            <RouterLink
              to="/registro"
              class="bg-secondary text-primary px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Registrarse
            </RouterLink>
          </div>

          <!-- User menu -->
          <div v-else class="hidden md:flex items-center space-x-3">
            <RouterLink
              v-if="authStore.canManageProducts"
              to="/admin"
              class="text-gray-300 hover:text-secondary transition-colors font-medium"
            >
              Admin
            </RouterLink>
            <RouterLink
              to="/perfil"
              class="text-gray-300 hover:text-secondary transition-colors font-medium"
            >
              {{ authStore.user?.name }}
            </RouterLink>
            <button
              @click="authStore.logout"
              class="text-gray-300 hover:text-secondary transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>

          <!-- Mobile menu button -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden text-gray-300 hover:text-secondary"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-show="isMobileMenuOpen" class="md:hidden bg-primary border-t border-gray-700">
      <div class="px-4 py-3 space-y-3">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="block text-gray-300 hover:text-secondary font-medium"
          @click="isMobileMenuOpen = false"
        >
          {{ link.name }}
        </RouterLink>
        <div v-if="!authStore.isAuthenticated" class="pt-3 border-t border-gray-700 space-y-3">
          <RouterLink
            to="/login"
            class="block text-gray-300 hover:text-secondary font-medium"
            @click="isMobileMenuOpen = false"
          >
            Iniciar sesion
          </RouterLink>
          <RouterLink
            to="/registro"
            class="block text-secondary font-medium"
            @click="isMobileMenuOpen = false"
          >
            Registrarse
          </RouterLink>
        </div>
        <div v-else class="pt-3 border-t border-gray-700 space-y-3">
          <RouterLink
            v-if="authStore.canManageProducts"
            to="/admin"
            class="block text-gray-300 hover:text-secondary font-medium"
            @click="isMobileMenuOpen = false"
          >
            Panel Admin
          </RouterLink>
          <RouterLink
            to="/perfil"
            class="block text-gray-300 hover:text-secondary font-medium"
            @click="isMobileMenuOpen = false"
          >
            Mi Perfil
          </RouterLink>
          <button
            @click="authStore.logout(); isMobileMenuOpen = false"
            class="block text-gray-300 hover:text-secondary font-medium"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
