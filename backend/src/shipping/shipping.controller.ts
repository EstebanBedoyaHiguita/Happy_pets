import { Controller, Get, Query } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('calculate')
  calculateShipping(
    @Query('department') department: string,
    @Query('city') city: string,
    @Query('subtotal') subtotal: string,
  ) {
    return this.shippingService.calculateShipping(
      department,
      city,
      parseFloat(subtotal) || 0,
    );
  }

  @Get('rates')
  getRates() {
    return this.shippingService.getShippingRates();
  }

  @Get('departments')
  getDepartments() {
    return this.shippingService.getDepartments();
  }
}
