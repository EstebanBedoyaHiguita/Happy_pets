import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async create(
    createPostDto: CreatePostDto,
    authorId: string,
  ): Promise<PostDocument> {
    const slug = createPostDto.slug || this.generateSlug(createPostDto.title);

    const post = new this.postModel({
      ...createPostDto,
      slug,
      author: authorId,
    });

    return (await post.save()).populate('author', 'name email');
  }

  async findAll(publishedOnly = false): Promise<PostDocument[]> {
    const filter = publishedOnly ? { published: true } : {};
    return this.postModel
      .find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<PostDocument> {
    const post = await this.postModel
      .findById(id)
      .populate('author', 'name email')
      .exec();
    if (!post) {
      throw new NotFoundException('Publicacion no encontrada');
    }
    return post;
  }

  async findBySlug(slug: string): Promise<PostDocument> {
    const post = await this.postModel
      .findOne({ slug, published: true })
      .populate('author', 'name email')
      .exec();
    if (!post) {
      throw new NotFoundException('Publicacion no encontrada');
    }
    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostDocument> {
    if (updatePostDto.title && !updatePostDto.slug) {
      updatePostDto.slug = this.generateSlug(updatePostDto.title);
    }

    const post = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .populate('author', 'name email')
      .exec();

    if (!post) {
      throw new NotFoundException('Publicacion no encontrada');
    }
    return post;
  }

  async remove(id: string): Promise<void> {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Publicacion no encontrada');
    }
  }
}
