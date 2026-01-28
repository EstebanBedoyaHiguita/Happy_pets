<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import api from '../services/api';
import type { Post } from '../types';

const route = useRoute();
const post = ref<Post | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await api.get<Post>(`/posts/slug/${route.params.slug}`);
    post.value = response.data;
  } catch (error) {
    console.error('Error loading post:', error);
  } finally {
    loading.value = false;
  }
});

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="max-w-4xl mx-auto px-4">
      <RouterLink to="/blog" class="text-accent hover:underline mb-6 inline-block">
        ← Volver al blog
      </RouterLink>
      <article v-if="post" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" class="w-full h-64 object-cover" />
        <div class="p-8">
          <p class="text-gray-500 mb-2">{{ formatDate(post.createdAt) }}</p>
          <h1 class="text-3xl font-bold text-primary mb-6">{{ post.title }}</h1>
          <div class="prose max-w-none" v-html="post.content"></div>
        </div>
      </article>
      <div v-else-if="!loading" class="text-center py-16">
        <p class="text-gray-500">Publicacion no encontrada</p>
      </div>
    </div>
  </div>
</template>
