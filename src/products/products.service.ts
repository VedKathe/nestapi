import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product)
  private productRespository: Repository<Product>) {

  }
  async create(createProductDto: CreateProductDto): Promise<{ product: Product }> {

    const { productid
      , name
      , description
      , price
      , category
      , stock } = createProductDto

    const product = await this.productRespository.create({
      productid
      , name
      , description
      , price
      , category
      , stock
    });

    try {
      await this.productRespository.save(product);
    } catch (error) {
      // Check if the error is a duplicate key error
      if (error.code === '23505') { // PostgreSQL unique violation error code
        throw new ConflictException('Product already exists');
      } else {
        throw error; // Rethrow other types of errors
      }
    }

    return { product };
  }

  async findAll() {

    const products = await this.productRespository.find()
    if (!products) {
      throw new NotFoundException('Product not found');
    }
    return products;
  }

  async findOne(id: string) {

    const products = await this.productRespository.findOne({ where: { id: id } })
    if (!products) {
      throw new NotFoundException('Product not found');
    }
    return products;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const products = await this.productRespository.findOne({ where: { id: id } })
    if (!products) {
      throw new NotFoundException('Product not found');
    }

    await this.productRespository.update(id, updateProductDto)

    return await this.productRespository.findOne({ where: { id: id } });
  }

  async remove(id: string) {

    const deleteResult = await this.productRespository.delete(id)
    if (deleteResult.affected === 0) {
      throw new NotFoundException('Product not found');
    }

    return deleteResult;
  }
}
