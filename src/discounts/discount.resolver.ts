import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './entities/discount.entity';
import { DiscountService } from './discounts.service';

@Resolver(() => Discount)
export class DiscountResolver {
  constructor(private readonly discountService: DiscountService) {}

  @Mutation(() => Discount)
  async createDiscount(
    @Args('createDiscountDto') createDiscountDto: CreateDiscountDto,
  ): Promise<Discount> {
    try {
      const createdDiscount =
        await this.discountService.create(createDiscountDto);
      return createdDiscount;
    } catch (error) {
      throw new Error(`Failed to create discount: ${error.message}`);
    }
  }

  @Mutation(() => Discount)
  async updateDiscount(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateDiscountDto') updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount> {
    try {
      const updatedDiscount = await this.discountService.update(
        id,
        updateDiscountDto,
      );
      return updatedDiscount;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error(`Failed to update discount: ${error.message}`);
    }
  }

  @Query(() => Discount)
  async findDiscount(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Discount> {
    try {
      const foundDiscount = await this.discountService.findOne(id);
      if (!foundDiscount) {
        throw new NotFoundException(`Discount with ID ${id} not found`);
      }
      return foundDiscount;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error(`Failed to find discount: ${error.message}`);
    }
  }

  @Query(() => [Discount])
  async findAllDiscounts(): Promise<Discount[]> {
    try {
      const foundDiscounts = await this.discountService.findAll();
      return foundDiscounts;
    } catch (error) {
      throw new Error(`Failed to find discounts: ${error.message}`);
    }
  }

  @Mutation(() => Boolean)
  async deleteDiscount(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    try {
      await this.discountService.remove(id);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete discount: ${error.message}`);
    }
  }
}
