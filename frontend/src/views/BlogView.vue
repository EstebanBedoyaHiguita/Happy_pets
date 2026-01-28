<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import api from '../services/api';
import type { Post } from '../types';

const posts = ref<Post[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await api.get<Post[]>('/posts?published=true');
    posts.value = response.data;
  } catch (error) {
    console.error('Error loading posts:', error);
  } finally {
    loading.value = false;
  }
});

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="bg-primary text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold">Blog</h1>
        <p class="mt-2 text-gray-300">Consejos y noticias para el cuidado de tu mascota</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="bg-white rounded-xl animate-pulse">
          <div class="aspect-video bg-gray-200 rounded-t-xl"></div>
          <div class="p-6 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-6 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="posts.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <RouterLink
          v-for="post in posts"
          :key="post._id"
          :to="`/blog/${post.slug}`"
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
        >
          <div class="aspect-video overflow-hidden">
            <img
              :src="post.coverImage || '/placeholder-blog.jpg'"
              :alt="post.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div class="p-6">
            <p class="text-sm text-gray-500 mb-2">{{ formatDate(post.createdAt) }}</p>
            <h2 class="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
              {{ post.title }}
            </h2>
            <p class="text-gray-600 line-clamp-3">{{ post.excerpt }}</p>
          </div>
        </RouterLink>
      </div>

      <div v-else class="text-center py-16">
        <p class="text-gray-500 text-lg">No hay publicaciones disponibles</p>
      </div>
    </div>
  </div>
</template>
