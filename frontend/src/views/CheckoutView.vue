<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const departments = ref<string[]>([]);
const form = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: '',
  address: '',
  city: '',
  department: '',
  notes: '',
});

const loading = ref(false);
const orderCreated = ref<{ orderNumber: string; total: number } | null>(null);
const error = ref('');

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
}

// Cargar departamentos disponibles
onMounted(async () => {
  try {
    const response = await api.get('/shipping/departments');
    departments.value = response.data;
  } catch (err) {
    console.error('Error loading departments:', err);
  }
});

// Recalcular envío cuando cambia departamento o ciudad
watch(
  () => [form.value.department, form.value.city],
  async ([department, city]) => {
    if (department && city && city.length >= 3) {
      await cartStore.calculateShipping(department, city);
    }
  }
);

async function handleCheckout() {
  error.value = '';
  loading.value = true;

  try {
    // Crear la orden
    const orderData = {
      items: cartStore.items.map(item => ({
        product: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingAddress: {
        name: form.value.name,
        phone: form.value.phone,
        email: form.value.email,
        address: form.value.address,
        city: form.value.city,
        department: form.value.department,
        notes: form.value.notes,
      },
    };

    const response = await api.post('/orders', orderData);

    orderCreated.value = {
      orderNumber: response.data.orderNumber,
      total: response.data.total,
    };

    // TODO: Integrar con Wompi para el pago
    // Por ahora mostramos confirmación de orden creada

  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { message?: string } } };
    error.value = axiosError.response?.data?.message || 'Error al crear la orden';
  } finally {
    loading.value = false;
  }
}

function finishOrder() {
  cartStore.clearCart();
  router.push('/');
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-primary mb-8">Checkout</h1>

      <!-- Orden creada exitosamente -->
      <div v-if="orderCreated" class="max-w-lg mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-primary mb-2">Orden creada</h2>
        <p class="text-gray-600 mb-4">
          Tu orden <span class="font-semibold">{{ orderCreated.orderNumber }}</span> ha sido creada exitosamente.
        </p>
        <p class="text-2xl font-bold text-secondary mb-6">
          Total: {{ formatPrice(orderCreated.total) }}
        </p>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p class="text-yellow-800 text-sm">
            La integracion con Wompi esta pendiente. Por favor contactanos para coordinar el pago.
          </p>
        </div>
        <button @click="finishOrder" class="btn-secondary">
          Volver al inicio
        </button>
      </div>

      <!-- Carrito vacío -->
      <div v-else-if="cartStore.items.length === 0" class="text-center py-16 bg-white rounded-xl">
        <p class="text-gray-500 mb-4">Tu carrito esta vacio</p>
        <RouterLink to="/tienda" class="btn-primary">Ir a la tienda</RouterLink>
      </div>

      <!-- Formulario de checkout -->
      <div v-else class="grid lg:grid-cols-2 gap-8">
        <!-- Form -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-bold text-primary mb-6">Datos de envio</h2>

          <div v-if="error" class="bg-error/10 text-error p-4 rounded-lg mb-6 text-sm">
            {{ error }}
          </div>

          <form @submit.prevent="handleCheckout" class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">Nombre completo *</label>
                <input v-model="form.name" type="text" required class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Telefono *</label>
                <input v-model="form.phone" type="tel" required class="input-field" placeholder="+57 300 123 4567" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Email *</label>
              <input v-model="form.email" type="email" required class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Direccion de envio *</label>
              <input v-model="form.address" type="text" required class="input-field" placeholder="Calle, numero, barrio" />
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">Departamento *</label>
                <select v-model="form.department" required class="input-field">
                  <option value="">Seleccionar...</option>
                  <option v-for="dept in departments" :key="dept" :value="dept">
                    {{ dept }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Ciudad *</label>
                <input
                  v-model="form.city"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Ej: Bogota"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Notas adicionales (opcional)</label>
              <textarea
                v-model="form.notes"
                class="input-field"
                rows="2"
                placeholder="Instrucciones de entrega, referencias, etc."
              ></textarea>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-blue-800 text-sm">
                <strong>Envio gratis</strong> en compras mayores a $150.000
              </p>
            </div>

            <button
              type="submit"
              :disabled="loading || cartStore.loadingShipping"
              class="w-full btn-secondary mt-6 disabled:opacity-50"
            >
              {{ loading ? 'Procesando...' : 'Confirmar pedido' }}
            </button>
          </form>
        </div>

        <!-- Summary -->
        <div class="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">
          <h2 class="text-xl font-bold text-primary mb-6">Resumen del pedido</h2>

          <div class="space-y-4 mb-6">
            <div v-for="item in cartStore.items" :key="item.productId" class="flex gap-4">
              <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded" />
              <div class="flex-1">
                <p class="font-medium line-clamp-1">{{ item.name }}</p>
                <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
              </div>
              <p class="font-medium">{{ formatPrice(item.price * item.quantity) }}</p>
            </div>
          </div>

          <div class="border-t pt-4 space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span>{{ formatPrice(cartStore.subtotal) }}</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-gray-600">Envio</span>
              <span v-if="cartStore.loadingShipping" class="text-sm text-gray-400">Calculando...</span>
              <span v-else-if="cartStore.isFreeShipping" class="text-success font-medium">Gratis</span>
              <span v-else>{{ formatPrice(cartStore.shipping) }}</span>
            </div>

            <div v-if="cartStore.shippingInfo" class="text-xs text-gray-500">
              Envio a {{ cartStore.shippingInfo.city }}, {{ cartStore.shippingInfo.department }}
            </div>

            <div class="flex justify-between text-xl font-bold pt-3 border-t">
              <span>Total</span>
              <span class="text-primary">{{ formatPrice(cartStore.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
