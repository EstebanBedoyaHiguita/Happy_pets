<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../../services/api';
import type { City, ShippingZone } from '../../types';

const cities = ref<City[]>([]);
const showModal = ref(false);
const editingCity = ref<City | null>(null);
const loading = ref(true);
const filterDepartment = ref('');

const form = ref({
  name: '',
  department: '',
  zone: 'zone1' as ShippingZone,
  active: true,
});

const zonePrices = {
  zone1: 10000,
  zone2: 15000,
};

const departments = computed(() => {
  const depts = [...new Set(cities.value.map((c) => c.department))];
  return depts.sort();
});

const filteredCities = computed(() => {
  if (!filterDepartment.value) return cities.value;
  return cities.value.filter((c) => c.department === filterDepartment.value);
});

async function loadData() {
  loading.value = true;
  try {
    const response = await api.get<City[]>('/cities');
    cities.value = response.data;
  } catch (error) {
    console.error('Error loading cities:', error);
  } finally {
    loading.value = false;
  }
}

function openModal(city?: City) {
  editingCity.value = city || null;
  form.value = city
    ? { name: city.name, department: city.department, zone: city.zone, active: city.active }
    : { name: '', department: '', zone: 'zone1', active: true };
  showModal.value = true;
}

async function saveCity() {
  try {
    if (editingCity.value) {
      await api.patch(`/cities/${editingCity.value._id}`, form.value);
    } else {
      await api.post('/cities', form.value);
    }
    showModal.value = false;
    await loadData();
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al guardar la ciudad');
  }
}

async function deleteCity(id: string) {
  if (confirm('¿Eliminar esta ciudad?')) {
    await api.delete(`/cities/${id}`);
    await loadData();
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
}

onMounted(loadData);
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-primary">Ciudades y Envíos</h1>
        <p class="text-sm text-gray-500 mt-1">
          Zona 1: {{ formatPrice(zonePrices.zone1) }} | Zona 2: {{ formatPrice(zonePrices.zone2) }}
        </p>
      </div>
      <button @click="openModal()" class="btn-secondary">+ Nueva ciudad</button>
    </div>

    <!-- Filtro por departamento -->
    <div class="mb-4">
      <select v-model="filterDepartment" class="input-field max-w-xs">
        <option value="">Todos los departamentos</option>
        <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
      </select>
    </div>

    <!-- Lista de ciudades -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Cargando ciudades...</p>
    </div>

    <div v-else-if="filteredCities.length === 0" class="text-center py-8 bg-white rounded-xl">
      <p class="text-gray-500">No hay ciudades registradas</p>
      <button @click="openModal()" class="mt-4 text-accent hover:underline">Agregar primera ciudad</button>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ciudad</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Departamento</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Zona</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Precio Envío</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
            <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="city in filteredCities" :key="city._id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ city.name }}</td>
            <td class="px-4 py-3 text-gray-600">{{ city.department }}</td>
            <td class="px-4 py-3">
              <span
                :class="city.zone === 'zone1' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ city.zone === 'zone1' ? 'Zona 1' : 'Zona 2' }}
              </span>
            </td>
            <td class="px-4 py-3 font-medium">{{ formatPrice(zonePrices[city.zone]) }}</td>
            <td class="px-4 py-3">
              <span
                :class="city.active ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'"
                class="px-2 py-1 rounded-full text-xs"
              >
                {{ city.active ? 'Activa' : 'Inactiva' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button @click="openModal(city)" class="text-accent text-sm mr-3">Editar</button>
              <button @click="deleteCity(city._id)" class="text-error text-sm">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">{{ editingCity ? 'Editar' : 'Nueva' }} Ciudad</h2>
        <form @submit.prevent="saveCity" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre de la ciudad</label>
            <input v-model="form.name" required class="input-field" placeholder="Ej: Bogotá" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Departamento</label>
            <input v-model="form.department" required class="input-field" placeholder="Ej: Cundinamarca" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Zona de envío</label>
            <select v-model="form.zone" class="input-field">
              <option value="zone1">Zona 1 - {{ formatPrice(zonePrices.zone1) }}</option>
              <option value="zone2">Zona 2 - {{ formatPrice(zonePrices.zone2) }}</option>
            </select>
          </div>
          <label class="flex items-center gap-2">
            <input v-model="form.active" type="checkbox" class="w-4 h-4" />
            <span>Activa</span>
          </label>
          <div class="flex gap-3 pt-4">
            <button type="button" @click="showModal = false" class="flex-1 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" class="flex-1 btn-secondary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
