<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import type { Category } from '../../types';

const categories = ref<Category[]>([]);
const showModal = ref(false);
const editingCategory = ref<Category | null>(null);
const form = ref({ name: '', description: '', active: true });

async function loadData() {
  const response = await api.get<Category[]>('/categories');
  categories.value = response.data;
}

function openModal(category?: Category) {
  editingCategory.value = category || null;
  form.value = category ? { name: category.name, description: category.description || '', active: category.active } : { name: '', description: '', active: true };
  showModal.value = true;
}

async function saveCategory() {
  if (editingCategory.value) {
    await api.patch(`/categories/${editingCategory.value._id}`, form.value);
  } else {
    await api.post('/categories', form.value);
  }
  showModal.value = false;
  await loadData();
}

async function deleteCategory(id: string) {
  if (confirm('Eliminar categoria?')) {
    await api.delete(`/categories/${id}`);
    await loadData();
  }
}

onMounted(loadData);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-primary">Categorias</h1>
      <button @click="openModal()" class="btn-secondary">+ Nueva categoria</button>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="cat in categories" :key="cat._id" class="bg-white rounded-xl shadow-sm p-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold">{{ cat.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ cat.description }}</p>
            <span :class="cat.active ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'" class="inline-block mt-2 px-2 py-1 rounded-full text-xs">
              {{ cat.active ? 'Activa' : 'Inactiva' }}
            </span>
          </div>
          <div class="flex gap-2">
            <button @click="openModal(cat)" class="text-accent text-sm">Editar</button>
            <button @click="deleteCategory(cat._id)" class="text-error text-sm">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">{{ editingCategory ? 'Editar' : 'Nueva' }} Categoria</h2>
        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre</label>
            <input v-model="form.name" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Descripcion</label>
            <textarea v-model="form.description" class="input-field" rows="2"></textarea>
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
