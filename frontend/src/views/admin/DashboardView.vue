<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const stats = ref({ products: 0, orders: 0, users: 0 });

onMounted(async () => {
  try {
    const [products] = await Promise.all([api.get('/products')]);
    stats.value.products = products.data.length;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-primary mb-8">Dashboard</h1>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Productos</p>
            <p class="text-3xl font-bold text-primary">{{ stats.products }}</p>
          </div>
          <span class="text-4xl">📦</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Pedidos</p>
            <p class="text-3xl font-bold text-primary">{{ stats.orders }}</p>
          </div>
          <span class="text-4xl">🛒</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Usuarios</p>
            <p class="text-3xl font-bold text-primary">{{ stats.users }}</p>
          </div>
          <span class="text-4xl">👥</span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold mb-4">Bienvenido al panel de administracion</h2>
      <p class="text-gray-600">
        Desde aqui puedes gestionar productos, categorias, publicaciones del blog,
        pedidos y usuarios de Happy Pets.
      </p>
    </div>
  </div>
</template>
