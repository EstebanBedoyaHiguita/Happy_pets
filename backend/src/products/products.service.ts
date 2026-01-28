import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  private async generateUniqueSKU(): Promise<string> {
    let sku: string;
    let exists = true;

    while (exists) {
      const random = Math.floor(10000 + Math.random() * 90000);
      sku = `HP-${random}`;
      const existingProduct = await this.productModel.findOne({ sku });
      exists = !!existingProduct;
    }

    return sku!;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const sku = await this.generateUniqueSKU();

    const product = new this.productModel({
      ...createProductDto,
      sku,
    });

    return product.save();
  }

  async findAll(filters?: {
    category?: string;
    available?: boolean;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ProductDocument[]> {
    const query: Record<string, unknown> = {};

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.available !== undefined) {
      query.available = filters.available;
    }

    if (filters?.featured !== undefined) {
      query.featured = filters.featured;
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      query.price = {};
      if (filters?.minPrice !== undefined) {
        (query.price as Record<string, number>).$gte = filters.minPrice;
      }
      if (filters?.maxPrice !== undefined) {
        (query.price as Record<string, number>).$lte = filters.maxPrice;
      }
    }

    return this.productModel.find(query).populate('category').exec();
  }

  async findFeatured(limit = 8): Promise<ProductDocument[]> {
    return this.productModel
      .find({ featured: true, available: true })
      .populate('category')
      .limit(limit)
      .exec();
  }

  async findBestSellers(limit = 8): Promise<ProductDocument[]> {
    return this.productModel
      .find({ available: true })
      .populate('category')
      .sort({ salesCount: -1 })
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .exec();

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async findBySku(sku: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findOne({ sku })
      .populate('category')
      .exec();

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('category')
      .exec();

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Producto no encontrado');
    }
  }

  async updateStock(id: string, quantity: number): Promise<ProductDocument> {
    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        { $inc: { stock: -quantity, salesCount: quantity } },
        { new: true },
      )
      .exec();

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }
}
