import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    const slug =
      createCategoryDto.slug || this.generateSlug(createCategoryDto.name);

    const existingCategory = await this.categoryModel.findOne({ slug });
    if (existingCategory) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }

    const category = new this.categoryModel({
      ...createCategoryDto,
      slug,
    });

    return category.save();
  }

  async findAll(activeOnly = false): Promise<CategoryDocument[]> {
    const filter = activeOnly ? { active: true } : {};
    return this.categoryModel.find(filter).exec();
  }

  async findOne(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return category;
  }

  async findBySlug(slug: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findOne({ slug }).exec();
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    if (updateCategoryDto.name && !updateCategoryDto.slug) {
      updateCategoryDto.slug = this.generateSlug(updateCategoryDto.name);
    }

    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Categoría no encontrada');
    }
  }
}
