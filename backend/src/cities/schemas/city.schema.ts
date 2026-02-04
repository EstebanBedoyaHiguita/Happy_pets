import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CityDocument = City & Document;

export enum ShippingZone {
  ZONE1 = 'zone1',
  ZONE2 = 'zone2',
}

export const SHIPPING_ZONE_PRICES = {
  [ShippingZone.ZONE1]: 10000,
  [ShippingZone.ZONE2]: 15000,
};

@Schema({ timestamps: true })
export class City {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true, enum: ShippingZone, default: ShippingZone.ZONE2 })
  zone: ShippingZone;

  @Prop({ default: true })
  active: boolean;
}

export const CitySchema = SchemaFactory.createForClass(City);

// Índice compuesto para evitar duplicados
CitySchema.index({ name: 1, department: 1 }, { unique: true });
