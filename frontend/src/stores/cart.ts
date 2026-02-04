import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { CartItem, Product, City } from '../types';

const CART_STORAGE_KEY = 'happypets_cart';
const SHIPPING_STORAGE_KEY = 'happypets_shipping';

// Precios por zona
const ZONE_PRICES = {
  zone1: 10000,
  zone2: 15000,
};

interface ShippingInfo {
  department: string;
  city: string;
  cityId: string;
  zone: 'zone1' | 'zone2';
  shippingCost: number;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const isOpen = ref(false);
  const shippingInfo = ref<ShippingInfo | null>(null);
  const loadingShipping = ref(false);

  // Load cart from localStorage on initialization
  function initialize() {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      items.value = JSON.parse(stored);
    }
    const storedShipping = localStorage.getItem(SHIPPING_STORAGE_KEY);
    if (storedShipping) {
      shippingInfo.value = JSON.parse(storedShipping);
    }
  }

  // Save to localStorage whenever items change
  watch(
    items,
    (newItems) => {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    },
    { deep: true }
  );

  watch(
    shippingInfo,
    (newShipping) => {
      if (newShipping) {
        localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(newShipping));
      } else {
        localStorage.removeItem(SHIPPING_STORAGE_KEY);
      }
    },
    { deep: true }
  );

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  // Envío basado en la ciudad seleccionada
  const shipping = computed(() => {
    return shippingInfo.value?.shippingCost || 0;
  });


  const total = computed(() => subtotal.value + shipping.value);

  function calculateShippingByCity(city: City) {
    const shippingCost = ZONE_PRICES[city.zone];

    shippingInfo.value = {
      department: city.department,
      city: city.name,
      cityId: city._id,
      zone: city.zone,
      shippingCost,
    };
    return shippingInfo.value;
  }

  function clearShippingInfo() {
    shippingInfo.value = null;
  }

  function addItem(product: Product, quantity = 1) {
    const existingItem = items.value.find(
      (item) => item.productId === product._id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0] || '/placeholder-product.jpg',
      });
    }
  }

  function removeItem(productId: string) {
    const index = items.value.findIndex((item) => item.productId === productId);
    if (index > -1) {
      items.value.splice(index, 1);
    }
  }

  function updateQuantity(productId: string, quantity: number) {
    const item = items.value.find((item) => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        removeItem(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  function clearCart() {
    items.value = [];
    shippingInfo.value = null;
  }

  function toggleCart() {
    isOpen.value = !isOpen.value;
  }

  function openCart() {
    isOpen.value = true;
  }

  function closeCart() {
    isOpen.value = false;
  }

  return {
    items,
    isOpen,
    itemCount,
    subtotal,
    shipping,
    total,
    shippingInfo,
    loadingShipping,
    initialize,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    calculateShippingByCity,
    clearShippingInfo,
  };
});
