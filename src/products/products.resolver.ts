import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductDto') createProductDto: CreateProductDto,
  ): Promise<Product> {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Query(() => [Product], { name: 'products' })
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Query(() => Product, { name: 'product' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Product> {
    try {
      return await this.productService.findOne(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateProductDto') updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      return await this.productService.update(id, updateProductDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => Boolean)
  async removeProduct(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    try {
      await this.productService.remove(id);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // @UseGuards(GqlAuthGuard)
  @Mutation(() => Product)
  async increaseAmount(
    @Args('id', { type: () => Int }) id: number,
    @Args('quantity', { type: () => Int }) quantity: number,
  ): Promise<Product> {
    return this.productService.increaseAmount(id, quantity);
  }
}
