import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Product } from '../products/entities/product.entity';
import { Discount } from './entities/discount.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    console.log('salom1');

    const { productId, discount_price } = createDiscountDto;
    console.log('salom2');

    // Find the product associated with the discount
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    console.log('salom3');
    console.log(product);

    // Save the current sale_price for later restoration
    product.original_sale_price = product.sale_price;

    // Update product's sale_price with discount_price

    product.sale_price = discount_price;
    await this.productRepository.save(product);

    // Create a new discount
    const newDiscount = this.discountRepository.create({
      product,
      discount_price,
      start_date: createDiscountDto.start_date,
      end_date: createDiscountDto.end_date,
    });
    

    // Save the discount entity
    const savedDiscount = await this.discountRepository.save(newDiscount);

    // Attach the originalSalePrice to the savedDiscount for response
    await this.discountRepository.save(savedDiscount);
    return savedDiscount;
  }

  async remove(id: number): Promise<void> {
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }

    // Get the original sale_price of the product before deleting the discount
     discount.product.sale_price = discount.product.original_sale_price;

     await this.productRepository.save(discount.product);
    // Delete the discount
    await this.discountRepository.delete(id);

    // Restore product's sale_price to its original value
  }

  async update(
    id: number,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount> {
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }

    // Update the discount entity
    discount.discount_price = updateDiscountDto.discount_price;
    discount.start_date = updateDiscountDto.start_date;
    discount.end_date = updateDiscountDto.end_date;

    // Update product's sale_price with new discount_price
    discount.product.sale_price = updateDiscountDto.discount_price;

    // Save the updated product entity
    // await this.discountRepository.save(discount.product);

    // Save the updated discount entity
    const updatedDiscount = await this.discountRepository.save(discount);

    // Attach the originalSalePrice to the updatedDiscount for response

    return updatedDiscount;
  }

  async findOne(id: number): Promise<Discount> {
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }
    return discount;
  }

  async findAll(): Promise<Discount[]> {
    return await this.discountRepository.find({ relations: ['product'] });
  }
}
