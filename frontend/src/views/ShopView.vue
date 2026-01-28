<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import api from '../services/api';
import type { Product, Category } from '../types';

const route = useRoute();

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);

const selectedCategory = ref<string>('');
const sortBy = ref<string>('name');
const showOnlyAvailable = ref(true);

onMounted(async () => {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      api.get<Product[]>('/products'),
      api.get<Category[]>('/categories?active=true'),
    ]);
    products.value = productsRes.data;
    categories.value = categoriesRes.data;

    if (route.query.category) {
      selectedCategory.value = route.query.category as string;
    }
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    loading.value = false;
  }
});

const filteredProducts = computed(() => {
  let result = [...products.value];

  if (selectedCategory.value) {
    result = result.filter(
      (p) => p.category && (p.category._id === selectedCategory.value || p.category.slug === selectedCategory.value)
    );
  }

  if (showOnlyAvailable.value) {
    result = result.filter((p) => p.available);
  }

  switch (sortBy.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return result;
});

watch(() => route.query.category, (newCategory) => {
  if (newCategory) {
    selectedCategory.value = newCategory as string;
  }
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="bg-primary text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold">Nuestra Tienda</h1>
        <p class="mt-2 text-gray-300">Encuentra todo lo que tu mascota necesita</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h3 class="font-semibold text-lg text-primary mb-4">Filtros</h3>

            <!-- Categories -->
            <div class="mb-6">
              <h4 class="font-medium text-dark mb-3">Categorias</h4>
              <div class="space-y-2">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="selectedCategory"
                    value=""
                    class="w-4 h-4 text-secondary"
                  />
                  <span class="ml-2 text-gray-700">Todas</span>
                </label>
                <label
                  v-for="category in categories"
                  :key="category._id"
                  class="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    v-model="selectedCategory"
                    :value="category._id"
                    class="w-4 h-4 text-secondary"
                  />
                  <span class="ml-2 text-gray-700">{{ category.name }}</span>
                </label>
              </div>
            </div>

            <!-- Availability -->
            <div class="mb-6">
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="showOnlyAvailable"
                  class="w-4 h-4 text-secondary rounded"
                />
                <span class="ml-2 text-gray-700">Solo disponibles</span>
              </label>
            </div>

            <!-- Sort -->
            <div>
              <h4 class="font-medium text-dark mb-3">Ordenar por</h4>
              <select
                v-model="sortBy"
                class="w-full input-field text-sm"
              >
                <option value="name">Nombre A-Z</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="newest">Mas recientes</option>
              </select>
            </div>
          </div>
        </aside>

        <!-- Products Grid -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <p class="text-gray-600">
              {{ filteredProducts.length }} producto(s) encontrado(s)
            </p>
          </div>

          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="bg-white rounded-xl animate-pulse">
              <div class="aspect-square bg-gray-200 rounded-t-xl"></div>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded"></div>
                <div class="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <div
            v-else-if="filteredProducts.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ProductCard
              v-for="product in filteredProducts"
              :key="product._id"
              :product="product"
            />
          </div>

          <div v-else class="text-center py-16">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500 text-lg">No se encontraron productos</p>
            <button
              @click="selectedCategory = ''; showOnlyAvailable = false"
              class="mt-4 text-accent hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
