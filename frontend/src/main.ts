import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize stores
const authStore = useAuthStore();
const cartStore = useCartStore();
authStore.initialize();
cartStore.initialize();

app.mount('#app');
