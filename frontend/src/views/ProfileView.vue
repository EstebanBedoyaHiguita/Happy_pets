<script setup lang="ts">
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-3xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-primary mb-8">Mi Perfil</h1>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center gap-4 mb-6 pb-6 border-b">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {{ authStore.user?.name?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h2 class="text-xl font-bold">{{ authStore.user?.name }}</h2>
            <p class="text-gray-500">{{ authStore.user?.email }}</p>
            <span class="inline-block mt-1 bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-full uppercase">
              {{ authStore.user?.role }}
            </span>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-500">Nombre</label>
            <p class="mt-1">{{ authStore.user?.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500">Email</label>
            <p class="mt-1">{{ authStore.user?.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500">Rol</label>
            <p class="mt-1 capitalize">{{ authStore.user?.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
