import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City, CityDocument, SHIPPING_ZONE_PRICES } from './schemas/city.schema';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    try {
      const city = new this.cityModel(createCityDto);
      return await city.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Esta ciudad ya existe en este departamento');
      }
      throw error;
    }
  }

  async findAll(activeOnly = false): Promise<City[]> {
    const filter = activeOnly ? { active: true } : {};
    return this.cityModel.find(filter).sort({ department: 1, name: 1 }).exec();
  }

  async findByDepartment(department: string): Promise<City[]> {
    return this.cityModel
      .find({ department: new RegExp(department, 'i'), active: true })
      .sort({ name: 1 })
      .exec();
  }

  async findOne(id: string): Promise<City> {
    const city = await this.cityModel.findById(id).exec();
    if (!city) {
      throw new NotFoundException('Ciudad no encontrada');
    }
    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    const city = await this.cityModel
      .findByIdAndUpdate(id, updateCityDto, { new: true })
      .exec();
    if (!city) {
      throw new NotFoundException('Ciudad no encontrada');
    }
    return city;
  }

  async remove(id: string): Promise<void> {
    const result = await this.cityModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Ciudad no encontrada');
    }
  }

  async getDepartments(): Promise<string[]> {
    const departments = await this.cityModel.distinct('department', { active: true }).exec();
    return departments.sort();
  }

  async getShippingCost(cityId: string): Promise<number> {
    const city = await this.findOne(cityId);
    return SHIPPING_ZONE_PRICES[city.zone];
  }

  getZonePrices() {
    return SHIPPING_ZONE_PRICES;
  }
}
