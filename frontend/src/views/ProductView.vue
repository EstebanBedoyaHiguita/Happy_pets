<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart';
import api from '../services/api';
import type { Product } from '../types';

const route = useRoute();
const cartStore = useCartStore();

const product = ref<Product | null>(null);
const loading = ref(true);
const quantity = ref(1);
const selectedImage = ref(0);

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
}

function addToCart() {
  if (product.value && product.value.available) {
    cartStore.addItem(product.value, quantity.value);
    cartStore.openCart();
  }
}

onMounted(async () => {
  try {
    const response = await api.get<Product>(`/products/${route.params.id}`);
    product.value = response.data;
  } catch (error) {
    console.error('Error loading product:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="animate-pulse">
        <div class="grid lg:grid-cols-2 gap-12">
          <div class="aspect-square bg-gray-200 rounded-2xl"></div>
          <div class="space-y-4">
            <div class="h-8 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-24 bg-gray-200 rounded"></div>
            <div class="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      <div v-else-if="product" class="grid lg:grid-cols-2 gap-12">
        <!-- Images -->
        <div>
          <div class="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
            <img
              :src="product.images[selectedImage] || '/placeholder-product.jpg'"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div v-if="product.images.length > 1" class="flex gap-4">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="selectedImage = index"
              class="w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors"
              :class="selectedImage === index ? 'border-secondary' : 'border-transparent'"
            >
              <img :src="image" :alt="`${product.name} ${index + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Info -->
        <div>
          <span class="text-sm text-gray-500 uppercase tracking-wide">SKU: {{ product.sku }}</span>
          <h1 class="text-3xl lg:text-4xl font-bold text-primary mt-2 mb-4">{{ product.name }}</h1>

          <div class="flex items-center gap-4 mb-6">
            <span class="text-3xl font-bold text-secondary">{{ formatPrice(product.price) }}</span>
            <span
              v-if="product.available"
              class="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium"
            >
              Disponible
            </span>
            <span v-else class="bg-error/10 text-error px-3 py-1 rounded-full text-sm font-medium">
              Agotado
            </span>
          </div>

          <p class="text-gray-600 mb-8 leading-relaxed">{{ product.description }}</p>

          <div v-if="product.available" class="flex items-center gap-4 mb-8">
            <div class="flex items-center border border-gray-300 rounded-lg">
              <button
                @click="quantity > 1 && quantity--"
                class="px-4 py-2 text-lg hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span class="px-4 py-2 font-medium">{{ quantity }}</span>
              <button
                @click="quantity++"
                class="px-4 py-2 text-lg hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
            <button @click="addToCart" class="btn-secondary flex-1">
              Agregar al carrito
            </button>
          </div>

          <div class="border-t pt-6 space-y-3 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Envio a todo Colombia</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Envio gratis en compras mayores a $100.000</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Pago seguro con Wompi</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16">
        <p class="text-gray-500 text-lg">Producto no encontrado</p>
      </div>
    </div>
  </div>
</template>
