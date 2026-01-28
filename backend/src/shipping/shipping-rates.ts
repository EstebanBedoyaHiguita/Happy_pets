// Tarifas de envío por departamento en Colombia (en pesos colombianos)
// Zonas:
// - Zona 1: Principales ciudades (Bogotá, Medellín, Cali, Barranquilla)
// - Zona 2: Ciudades intermedias
// - Zona 3: Resto del país

export interface ShippingRate {
  department: string;
  cities?: Record<string, number>; // Tarifas específicas por ciudad
  defaultRate: number; // Tarifa por defecto del departamento
  zone: 1 | 2 | 3;
}

export const SHIPPING_RATES: ShippingRate[] = [
  // Zona 1 - Principales ciudades
  {
    department: 'Cundinamarca',
    cities: {
      bogota: 8000,
      soacha: 10000,
      chia: 12000,
      zipaquira: 15000,
    },
    defaultRate: 18000,
    zone: 1,
  },
  {
    department: 'Antioquia',
    cities: {
      medellin: 12000,
      envigado: 12000,
      bello: 14000,
      itagui: 14000,
    },
    defaultRate: 20000,
    zone: 1,
  },
  {
    department: 'Valle del Cauca',
    cities: {
      cali: 12000,
      palmira: 15000,
      buenaventura: 22000,
    },
    defaultRate: 20000,
    zone: 1,
  },
  {
    department: 'Atlantico',
    cities: {
      barranquilla: 15000,
      soledad: 15000,
    },
    defaultRate: 20000,
    zone: 1,
  },

  // Zona 2 - Ciudades intermedias
  {
    department: 'Santander',
    cities: {
      bucaramanga: 18000,
      floridablanca: 18000,
    },
    defaultRate: 25000,
    zone: 2,
  },
  {
    department: 'Bolivar',
    cities: {
      cartagena: 18000,
    },
    defaultRate: 25000,
    zone: 2,
  },
  {
    department: 'Norte de Santander',
    cities: {
      cucuta: 20000,
    },
    defaultRate: 28000,
    zone: 2,
  },
  {
    department: 'Risaralda',
    cities: {
      pereira: 18000,
    },
    defaultRate: 22000,
    zone: 2,
  },
  {
    department: 'Caldas',
    cities: {
      manizales: 18000,
    },
    defaultRate: 22000,
    zone: 2,
  },
  {
    department: 'Tolima',
    cities: {
      ibague: 18000,
    },
    defaultRate: 25000,
    zone: 2,
  },
  {
    department: 'Huila',
    cities: {
      neiva: 20000,
    },
    defaultRate: 28000,
    zone: 2,
  },
  {
    department: 'Boyaca',
    cities: {
      tunja: 15000,
      duitama: 18000,
    },
    defaultRate: 22000,
    zone: 2,
  },
  {
    department: 'Meta',
    cities: {
      villavicencio: 18000,
    },
    defaultRate: 28000,
    zone: 2,
  },
  {
    department: 'Narino',
    cities: {
      pasto: 22000,
    },
    defaultRate: 30000,
    zone: 2,
  },
  {
    department: 'Cordoba',
    cities: {
      monteria: 20000,
    },
    defaultRate: 28000,
    zone: 2,
  },
  {
    department: 'Magdalena',
    cities: {
      'santa marta': 18000,
    },
    defaultRate: 25000,
    zone: 2,
  },
  {
    department: 'Cesar',
    cities: {
      valledupar: 22000,
    },
    defaultRate: 28000,
    zone: 2,
  },
  {
    department: 'Quindio',
    cities: {
      armenia: 18000,
    },
    defaultRate: 22000,
    zone: 2,
  },
  {
    department: 'Cauca',
    cities: {
      popayan: 22000,
    },
    defaultRate: 30000,
    zone: 2,
  },

  // Zona 3 - Resto del país (tarifas más altas)
  { department: 'Sucre', defaultRate: 32000, zone: 3 },
  { department: 'La Guajira', defaultRate: 35000, zone: 3 },
  { department: 'Choco', defaultRate: 40000, zone: 3 },
  { department: 'Putumayo', defaultRate: 38000, zone: 3 },
  { department: 'Caqueta', defaultRate: 35000, zone: 3 },
  { department: 'Arauca', defaultRate: 38000, zone: 3 },
  { department: 'Casanare', defaultRate: 32000, zone: 3 },
  { department: 'Guaviare', defaultRate: 45000, zone: 3 },
  { department: 'Vaupes', defaultRate: 50000, zone: 3 },
  { department: 'Amazonas', defaultRate: 55000, zone: 3 },
  { department: 'Guainia', defaultRate: 50000, zone: 3 },
  { department: 'Vichada', defaultRate: 50000, zone: 3 },
  { department: 'San Andres y Providencia', defaultRate: 45000, zone: 3 },
];

// Umbral para envío gratis (en pesos)
export const FREE_SHIPPING_THRESHOLD = 150000;

// Tarifa por defecto si no se encuentra el departamento
export const DEFAULT_SHIPPING_RATE = 35000;
