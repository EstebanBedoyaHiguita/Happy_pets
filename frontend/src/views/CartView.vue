<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-primary mb-8">Tu Carrito</h1>

      <div v-if="cartStore.items.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm">
        <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-500 text-lg mb-4">Tu carrito esta vacio</p>
        <RouterLink to="/tienda" class="btn-primary">
          Ir a la tienda
        </RouterLink>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.productId"
            class="bg-white rounded-xl shadow-sm p-4 flex gap-4"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-24 h-24 object-cover rounded-lg"
            />
            <div class="flex-1">
              <h3 class="font-semibold text-dark">{{ item.name }}</h3>
              <p class="text-secondary font-bold">{{ formatPrice(item.price) }}</p>
              <div class="flex items-center gap-4 mt-3">
                <div class="flex items-center border border-gray-300 rounded-lg">
                  <button
                    @click="cartStore.updateQuantity(item.productId, item.quantity - 1)"
                    class="px-3 py-1 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span class="px-3 py-1 font-medium">{{ item.quantity }}</span>
                  <button
                    @click="cartStore.updateQuantity(item.productId, item.quantity + 1)"
                    class="px-3 py-1 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  @click="cartStore.removeItem(item.productId)"
                  class="text-error hover:underline text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-primary">{{ formatPrice(item.price * item.quantity) }}</p>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 class="text-xl font-bold text-primary mb-6">Resumen</h2>
            <div class="space-y-3 text-sm border-b pb-4 mb-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span>{{ formatPrice(cartStore.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Envio</span>
                <span>{{ cartStore.shipping === 0 ? 'Gratis' : formatPrice(cartStore.shipping) }}</span>
              </div>
            </div>
            <div class="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span class="text-primary">{{ formatPrice(cartStore.total) }}</span>
            </div>
            <RouterLink to="/checkout" class="block w-full btn-secondary text-center">
              Finalizar compra
            </RouterLink>
            <RouterLink to="/tienda" class="block w-full text-center mt-3 text-accent hover:underline">
              Seguir comprando
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
