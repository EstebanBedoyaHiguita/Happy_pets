import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  CUSTOMER = 'customer',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;

  @Prop({
    type: {
      street: String,
      city: String,
      department: String,
      zipCode: String,
    },
  })
  address: {
    street: string;
    city: string;
    department: string;
    zipCode: string;
  };

  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
