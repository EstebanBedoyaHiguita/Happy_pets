import { Injectable } from '@nestjs/common';
import {
  SHIPPING_RATES,
  FREE_SHIPPING_THRESHOLD,
  DEFAULT_SHIPPING_RATE,
  ShippingRate,
} from './shipping-rates';

export interface ShippingCalculation {
  subtotal: number;
  shippingCost: number;
  isFreeShipping: boolean;
  total: number;
  zone: number;
  department: string;
  city?: string;
}

@Injectable()
export class ShippingService {
  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  private findDepartmentRate(department: string): ShippingRate | undefined {
    const normalizedDepartment = this.normalizeString(department);

    return SHIPPING_RATES.find((rate) => {
      const rateDepartment = this.normalizeString(rate.department);
      return (
        rateDepartment === normalizedDepartment ||
        rateDepartment.includes(normalizedDepartment) ||
        normalizedDepartment.includes(rateDepartment)
      );
    });
  }

  calculateShipping(
    department: string,
    city: string,
    subtotal: number,
  ): ShippingCalculation {
    // Buscar tarifa del departamento
    const departmentRate = this.findDepartmentRate(department);

    let shippingCost = DEFAULT_SHIPPING_RATE;
    let zone = 3;

    if (departmentRate) {
      zone = departmentRate.zone;

      // Buscar tarifa específica de la ciudad
      if (departmentRate.cities) {
        const normalizedCity = this.normalizeString(city);
        const cityRate = Object.entries(departmentRate.cities).find(
          ([cityName]) => {
            const normalizedCityName = this.normalizeString(cityName);
            return (
              normalizedCityName === normalizedCity ||
              normalizedCityName.includes(normalizedCity) ||
              normalizedCity.includes(normalizedCityName)
            );
          },
        );

        if (cityRate) {
          shippingCost = cityRate[1];
        } else {
          shippingCost = departmentRate.defaultRate;
        }
      } else {
        shippingCost = departmentRate.defaultRate;
      }
    }

    // Verificar si aplica envío gratis
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const finalShippingCost = isFreeShipping ? 0 : shippingCost;

    return {
      subtotal,
      shippingCost: finalShippingCost,
      isFreeShipping,
      total: subtotal + finalShippingCost,
      zone,
      department: departmentRate?.department || department,
      city,
    };
  }

  getShippingRates() {
    return {
      rates: SHIPPING_RATES,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      defaultRate: DEFAULT_SHIPPING_RATE,
    };
  }

  getDepartments(): string[] {
    return SHIPPING_RATES.map((rate) => rate.department).sort();
  }
}
