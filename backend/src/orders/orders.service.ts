import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ShippingService } from '../shipping/shipping.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private shippingService: ShippingService,
    private productsService: ProductsService,
  ) {}

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Contar órdenes del día
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await this.orderModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `HP${year}${month}${day}-${sequence}`;
  }

  async create(
    createOrderDto: CreateOrderDto,
    customerId?: string,
  ): Promise<OrderDocument> {
    // Calcular subtotal
    const subtotal = createOrderDto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Calcular envío basado en la dirección
    const shippingCalc = this.shippingService.calculateShipping(
      createOrderDto.shippingAddress.department,
      createOrderDto.shippingAddress.city,
      subtotal,
    );

    // Generar número de orden
    const orderNumber = await this.generateOrderNumber();

    // Crear orden
    const order = new this.orderModel({
      orderNumber,
      customer: customerId,
      items: createOrderDto.items,
      subtotal,
      shipping: shippingCalc.shippingCost,
      total: shippingCalc.total,
      shippingAddress: createOrderDto.shippingAddress,
      status: OrderStatus.PENDING,
    });

    return order.save();
  }

  async findAll(): Promise<OrderDocument[]> {
    return this.orderModel
      .find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCustomer(customerId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ customer: customerId } as any)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findById(id)
      .populate('customer', 'name email')
      .exec();

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }
    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findOne({ orderNumber })
      .populate('customer', 'name email')
      .exec();

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }
    return order;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderDocument> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .populate('customer', 'name email')
      .exec();

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Si la orden fue pagada, actualizar stock
    if (updateOrderDto.status === OrderStatus.PAID) {
      for (const item of order.items) {
        await this.productsService.updateStock(item.product, item.quantity);
      }
    }

    return order;
  }

  async updatePayment(
    id: string,
    paymentRef: string,
    paymentMethod: string,
    paymentDetails?: Record<string, unknown>,
  ): Promise<OrderDocument> {
    const order = await this.orderModel
      .findByIdAndUpdate(
        id,
        {
          paymentRef,
          paymentMethod,
          paymentDetails,
          status: OrderStatus.PAID,
        },
        { new: true },
      )
      .exec();

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Actualizar stock de productos
    for (const item of order.items) {
      await this.productsService.updateStock(item.product, item.quantity);
    }

    return order;
  }

  async getStats() {
    const [totalOrders, pendingOrders, paidOrders, totalRevenue] =
      await Promise.all([
        this.orderModel.countDocuments(),
        this.orderModel.countDocuments({ status: OrderStatus.PENDING }),
        this.orderModel.countDocuments({ status: OrderStatus.PAID }),
        this.orderModel.aggregate([
          { $match: { status: { $in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED] } } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
      ]);

    return {
      totalOrders,
      pendingOrders,
      paidOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    };
  }
}
