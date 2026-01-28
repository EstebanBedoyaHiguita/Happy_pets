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
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="cartStore.isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="cartStore.closeCart"
      />
    </Transition>

    <!-- Sidebar -->
    <Transition name="slide">
      <div
        v-if="cartStore.isOpen"
        class="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-xl font-bold text-primary">Tu Carrito</h2>
          <button
            @click="cartStore.closeCart"
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Items -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="cartStore.items.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-gray-500">Tu carrito esta vacio</p>
            <RouterLink
              to="/tienda"
              @click="cartStore.closeCart"
              class="inline-block mt-4 text-accent hover:underline"
            >
              Ir a la tienda
            </RouterLink>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.productId"
              class="flex gap-4 p-3 bg-gray-50 rounded-lg"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-20 h-20 object-cover rounded-lg"
              />
              <div class="flex-1">
                <h3 class="font-medium text-dark line-clamp-1">{{ item.name }}</h3>
                <p class="text-secondary font-bold">{{ formatPrice(item.price) }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <button
                    @click="cartStore.updateQuantity(item.productId, item.quantity - 1)"
                    class="w-7 h-7 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span class="w-8 text-center">{{ item.quantity }}</span>
                  <button
                    @click="cartStore.updateQuantity(item.productId, item.quantity + 1)"
                    class="w-7 h-7 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                @click="cartStore.removeItem(item.productId)"
                class="text-gray-400 hover:text-error transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="cartStore.items.length > 0" class="border-t p-4 space-y-4">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span>{{ formatPrice(cartStore.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Envio</span>
              <span>{{ cartStore.shipping === 0 ? 'Gratis' : formatPrice(cartStore.shipping) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span class="text-primary">{{ formatPrice(cartStore.total) }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <RouterLink
              to="/carrito"
              @click="cartStore.closeCart"
              class="block w-full text-center py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Ver carrito
            </RouterLink>
            <RouterLink
              to="/checkout"
              @click="cartStore.closeCart"
              class="block w-full text-center py-3 bg-secondary text-primary rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Finalizar compra
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
