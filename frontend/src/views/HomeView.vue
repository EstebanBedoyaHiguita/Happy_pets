<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import api from '../services/api';
import type { Product, Category } from '../types';

const featuredProducts = ref<Product[]>([]);
const bestSellers = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const [featuredRes, bestSellersRes, categoriesRes] = await Promise.all([
      api.get<Product[]>('/products/featured?limit=4'),
      api.get<Product[]>('/products/best-sellers?limit=4'),
      api.get<Category[]>('/categories?active=true'),
    ]);
    featuredProducts.value = featuredRes.data;
    bestSellers.value = bestSellersRes.data;
    categories.value = categoriesRes.data;
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-primary text-white overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-4xl lg:text-6xl font-bold mb-6">
              Todo para tu
              <span class="text-secondary">mejor amigo</span>
            </h1>
            <p class="text-lg text-white mb-8 max-w-lg">
              Descubre nuestra seleccion de productos premium para mascotas.
              Calidad, amor y cuidado en cada producto.
            </p>
            <div class="flex flex-wrap gap-4">
              <RouterLink to="/tienda" class="btn-secondary">
                Ver tienda
              </RouterLink>
              <RouterLink
                to="/nosotros"
                class="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-all duration-300"
              >
                Conocenos
              </RouterLink>
            </div>
          </div>
          <div class="hidden lg:block">
            <div class="relative">
              <div class="absolute -top-4 -left-4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
              <div class="absolute -bottom-4 -right-4 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
              <div class="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center">
                <span class="text-9xl">🐕</span>
                <p class="mt-4 text-xl font-medium">Felicidad garantizada</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Preview -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="categories.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <RouterLink
            v-for="category in categories"
            :key="category._id"
            :to="`/tienda?category=${category.slug}`"
            class="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <span v-if="category.icon" class="text-5xl mb-3 block group-hover:scale-110 transition-transform">{{ category.icon }}</span>
            <img v-else-if="category.image" :src="category.image" :alt="category.name" class="w-16 h-16 mx-auto mb-3 object-contain group-hover:scale-110 transition-transform" />
            <span v-else class="text-5xl mb-3 block group-hover:scale-110 transition-transform">🐾</span>
            <h3 class="font-semibold text-dark">{{ category.name }}</h3>
          </RouterLink>
        </div>
        <div v-else-if="!loading" class="text-center py-8 text-gray-500">
          <p>No hay categorías disponibles</p>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-3xl font-bold text-primary">Productos destacados</h2>
            <p class="text-gray-600 mt-2">Lo mejor para tu mascota</p>
          </div>
          <RouterLink
            to="/tienda?featured=true"
            class="text-accent hover:underline font-medium hidden sm:block"
          >
            Ver todos
          </RouterLink>
        </div>

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-white rounded-xl animate-pulse">
            <div class="aspect-square bg-gray-200 rounded-t-xl"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded"></div>
              <div class="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <div v-else-if="featuredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product._id"
            :product="product"
          />
        </div>

        <div v-else class="text-center py-12 text-gray-500">
          <p>No hay productos destacados disponibles</p>
        </div>
      </div>
    </section>

    <!-- Best Sellers -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-3xl font-bold text-primary">Mas vendidos</h2>
            <p class="text-gray-600 mt-2">Los favoritos de nuestros clientes</p>
          </div>
          <RouterLink
            to="/tienda"
            class="text-accent hover:underline font-medium hidden sm:block"
          >
            Ver todos
          </RouterLink>
        </div>

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-gray-50 rounded-xl animate-pulse">
            <div class="aspect-square bg-gray-200 rounded-t-xl"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded"></div>
              <div class="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <div v-else-if="bestSellers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in bestSellers"
            :key="product._id"
            :product="product"
          />
        </div>

        <div v-else class="text-center py-12 text-gray-500">
          <p>No hay productos disponibles</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-secondary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-primary mb-4">
          Comienza hoy a darle lo mejor a tu mascota
        </h2>
        <p class="text-primary/80 mb-8 max-w-2xl mx-auto">
          Recibe tus productos en la puerta de tu casa 🐶.
        </p>
        <RouterLink to="/tienda" class="btn-primary">
          Comprar ahora
        </RouterLink>
      </div>
    </section>
  </div>
</template>
