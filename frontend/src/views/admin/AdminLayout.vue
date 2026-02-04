<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const route = useRoute();

const menuItems = [
  { name: 'Dashboard', to: '/admin', icon: '📊' },
  { name: 'Productos', to: '/admin/productos', icon: '📦' },
  { name: 'Categorias', to: '/admin/categorias', icon: '🏷️' },
  { name: 'Ciudades', to: '/admin/ciudades', icon: '🚚' },
  { name: 'Blog', to: '/admin/blog', icon: '📝' },
  { name: 'Pedidos', to: '/admin/pedidos', icon: '🛒' },
  { name: 'Usuarios', to: '/admin/usuarios', icon: '👥', adminOnly: true },
];

const filteredMenuItems = menuItems.filter(
  (item) => !item.adminOnly || authStore.isAdmin
);
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-primary text-white flex-shrink-0">
      <div class="p-4 border-b border-white/10">
        <RouterLink to="/" class="flex items-center gap-2">
          <span class="text-2xl">🐾</span>
          <span class="font-bold">Happy Pets</span>
        </RouterLink>
        <p class="text-xs text-gray-400 mt-1">Panel de Administracion</p>
      </div>

      <nav class="p-4">
        <ul class="space-y-2">
          <li v-for="item in filteredMenuItems" :key="item.to">
            <RouterLink
              :to="item.to"
              class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
              :class="route.path === item.to ? 'bg-secondary text-primary' : 'hover:bg-white/10'"
            >
              <span>{{ item.icon }}</span>
              <span>{{ item.name }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="absolute bottom-0 left-0 w-64 p-4 border-t border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">
            {{ authStore.user?.name?.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-400 capitalize">{{ authStore.user?.role }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-8 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>
