import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/nosotros',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/tienda',
    name: 'shop',
    component: () => import('../views/ShopView.vue'),
  },
  {
    path: '/producto/:id',
    name: 'product',
    component: () => import('../views/ProductView.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogView.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('../views/BlogPostView.vue'),
  },
  {
    path: '/carrito',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/registro',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/perfil',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../views/admin/DashboardView.vue'),
      },
      {
        path: 'productos',
        name: 'admin-products',
        component: () => import('../views/admin/ProductsView.vue'),
      },
      {
        path: 'categorias',
        name: 'admin-categories',
        component: () => import('../views/admin/CategoriesView.vue'),
      },
      {
        path: 'blog',
        name: 'admin-blog',
        component: () => import('../views/admin/BlogView.vue'),
      },
      {
        path: 'pedidos',
        name: 'admin-orders',
        component: () => import('../views/admin/OrdersView.vue'),
      },
      {
        path: 'usuarios',
        name: 'admin-users',
        component: () => import('../views/admin/UsersView.vue'),
      },
      {
        path: 'ciudades',
        name: 'admin-cities',
        component: () => import('../views/admin/CitiesView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresAdmin && !authStore.isAdmin && !authStore.isAgent) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
