<script setup lang="ts">
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-primary text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6">Sobre Nosotros</h1>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto">
          En Happy Pets creemos que cada mascota merece lo mejor. Por eso trabajamos
          cada dia para ofrecerte productos de calidad que hagan feliz a tu companero de vida.
        </p>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12">
          <div class="bg-gray-50 rounded-2xl p-8">
            <div class="w-16 h-16 bg-secondary/20 rounded-xl flex items-center justify-center mb-6">
              <span class="text-3xl">🎯</span>
            </div>
            <h2 class="text-2xl font-bold text-primary mb-4">Nuestra Mision</h2>
            <p class="text-gray-600 leading-relaxed">
              Proveer a las familias colombianas productos de alta calidad para el cuidado
              y bienestar de sus mascotas, facilitando el acceso a articulos premium a
              precios justos y con un servicio excepcional.
            </p>
          </div>

          <div class="bg-gray-50 rounded-2xl p-8">
            <div class="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center mb-6">
              <span class="text-3xl">🌟</span>
            </div>
            <h2 class="text-2xl font-bold text-primary mb-4">Nuestra Vision</h2>
            <p class="text-gray-600 leading-relaxed">
              Ser la tienda de mascotas lider en Colombia, reconocida por nuestra calidad,
              variedad de productos y compromiso con el bienestar animal. Queremos ser
              la primera opcion de cada familia con mascotas.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-primary text-center mb-12">Nuestros Valores</h2>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="text-4xl">❤️</span>
            </div>
            <h3 class="font-semibold text-lg text-dark mb-2">Amor</h3>
            <p class="text-gray-600 text-sm">
              Amamos a los animales tanto como tu
            </p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="text-4xl">✨</span>
            </div>
            <h3 class="font-semibold text-lg text-dark mb-2">Calidad</h3>
            <p class="text-gray-600 text-sm">
              Solo los mejores productos para tu mascota
            </p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="text-4xl">🤝</span>
            </div>
            <h3 class="font-semibold text-lg text-dark mb-2">Confianza</h3>
            <p class="text-gray-600 text-sm">
              Transparencia en cada transaccion
            </p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="text-4xl">🚀</span>
            </div>
            <h3 class="font-semibold text-lg text-dark mb-2">Compromiso</h3>
            <p class="text-gray-600 text-sm">
              Siempre buscando mejorar por ti
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-16 bg-primary text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl lg:text-5xl font-bold text-secondary mb-2">500+</div>
            <div class="text-gray-300">Productos</div>
          </div>
          <div>
            <div class="text-4xl lg:text-5xl font-bold text-secondary mb-2">10K+</div>
            <div class="text-gray-300">Clientes felices</div>
          </div>
          <div>
            <div class="text-4xl lg:text-5xl font-bold text-secondary mb-2">32</div>
            <div class="text-gray-300">Ciudades</div>
          </div>
          <div>
            <div class="text-4xl lg:text-5xl font-bold text-secondary mb-2">5</div>
            <div class="text-gray-300">Anos de experiencia</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-primary mb-4">Tienes alguna pregunta?</h2>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
          Estamos aqui para ayudarte. Contactanos y con gusto resolveremos todas tus dudas.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:info@happypets.co"
            class="btn-primary flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Enviar correo
          </a>
          <a
            href="https://wa.me/573001234567"
            target="_blank"
            class="btn-secondary flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
