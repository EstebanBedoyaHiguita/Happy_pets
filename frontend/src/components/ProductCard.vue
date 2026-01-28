<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useCartStore } from '../stores/cart';
import type { Product } from '../types';

const props = defineProps<{
  product: Product;
}>();

const cartStore = useCartStore();

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
}

function addToCart() {
  if (props.product.available) {
    cartStore.addItem(props.product);
    cartStore.openCart();
  }
}
</script>

<template>
  <div class="product-card group">
    <RouterLink :to="`/producto/${product._id}`" class="block">
      <!-- Image container -->
      <div class="relative overflow-hidden aspect-square bg-gray-100">
        <img
          :src="product.images[0] || '/placeholder-product.jpg'"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <!-- Featured badge -->
        <span
          v-if="product.featured"
          class="absolute top-3 left-3 bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full"
        >
          Destacado
        </span>
        <!-- Out of stock badge -->
        <div
          v-if="!product.available"
          class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <span class="bg-error text-white text-sm font-bold px-4 py-2 rounded-lg">
            Agotado
          </span>
        </div>
      </div>
    </RouterLink>

    <!-- Content -->
    <div class="p-4">
      <RouterLink :to="`/producto/${product._id}`">
        <h3 class="font-semibold text-dark group-hover:text-accent transition-colors line-clamp-2 mb-2">
          {{ product.name }}
        </h3>
      </RouterLink>

      <p class="text-sm text-gray-500 mb-3 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="flex items-center justify-between">
        <span class="text-xl font-bold text-primary">
          {{ formatPrice(product.price) }}
        </span>

        <button
          @click.prevent="addToCart"
          :disabled="!product.available"
          class="bg-primary text-white p-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
          :class="{ 'hover:scale-105': product.available }"
        >
          <svg
            class="w-5 h-5 group-hover/btn:scale-110 transition-transform"
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
        </button>
      </div>
    </div>
  </div>
</template>
