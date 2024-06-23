import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Category or Store not found.' })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Return all products.',
    type: [Product],
  })
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the product.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Param('id') id: number): Promise<Product> {
    try {
      return await this.productService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product, Category or Store not found.',
  })
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      return await this.productService.update(id, updateProductDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: 204,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async remove(@Param('id') id: number): Promise<void> {
    try {
      return await this.productService.remove(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Increase amount of a product by ID' })
  @ApiResponse({
    status: 204,
    description: 'The amount of product has been successfully increase.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Post(':id/increase-amount')
  async increaseAmount(
    @Param('id') id: number,
    @Body('quantity') quantity: number,
  ) {
    return this.productService.increaseAmount(id, quantity);
  }
}
