<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const phone = ref('');
const error = ref('');
const loading = ref(false);

async function handleSubmit() {
  error.value = '';
  loading.value = true;

  try {
    await authStore.register(name.value, email.value, password.value, phone.value);
    router.push('/');
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { message?: string } } };
    error.value = axiosError.response?.data?.message || 'Error al registrarse';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <RouterLink to="/" class="inline-flex items-center gap-2">
          <span class="text-4xl">🐾</span>
          <span class="text-2xl font-bold text-primary">Happy Pets</span>
        </RouterLink>
        <h1 class="mt-6 text-3xl font-bold text-primary">Crear cuenta</h1>
        <p class="mt-2 text-gray-600">Unete a la familia Happy Pets</p>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="bg-error/10 text-error p-4 rounded-lg text-sm">
            {{ error }}
          </div>

          <div>
            <label class="block text-sm font-medium text-dark mb-2">Nombre completo</label>
            <input
              v-model="name"
              type="text"
              required
              class="input-field"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-dark mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="input-field"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-dark mb-2">Telefono (opcional)</label>
            <input
              v-model="phone"
              type="tel"
              class="input-field"
              placeholder="+57 300 123 4567"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-dark mb-2">Contrasena</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              class="input-field"
              placeholder="Minimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-secondary disabled:opacity-50"
          >
            {{ loading ? 'Cargando...' : 'Crear cuenta' }}
          </button>
        </form>

        <p class="mt-6 text-center text-gray-600">
          Ya tienes cuenta?
          <RouterLink to="/login" class="text-accent hover:underline font-medium">
            Inicia sesion
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
