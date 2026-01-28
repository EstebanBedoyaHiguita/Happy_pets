<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import type { User } from '../../types';

const users = ref<User[]>([]);

async function loadUsers() {
  try {
    const response = await api.get<User[]>('/users');
    users.value = response.data;
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

onMounted(loadUsers);
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-primary mb-6">Usuarios</h1>
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium">Usuario</th>
            <th class="px-4 py-3 text-left text-sm font-medium">Email</th>
            <th class="px-4 py-3 text-left text-sm font-medium">Rol</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ user.name }}</td>
            <td class="px-4 py-3 text-gray-500">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span class="bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs uppercase">
                {{ user.role }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
