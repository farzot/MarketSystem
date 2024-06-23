import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpException,
  Patch,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DiscountService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Discount } from './entities/discount.entity';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@ApiTags('Discounts')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Created' })
  async create(
    @Body() createDiscountDto: CreateDiscountDto,
  ): Promise<Discount> {
    try {
      const createdDiscount =
        await this.discountService.create(createDiscountDto);
      return createdDiscount;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Updated' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount> {
    try {
      const updatedDiscount = await this.discountService.update(
        id,
        updateDiscountDto,
      );
      return updatedDiscount;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Discount> {
    try {
      const foundDiscount = await this.discountService.findOne(id);
      return foundDiscount;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Found All' })
  async findAll(): Promise<Discount[]> {
    try {
      const foundDiscounts = await this.discountService.findAll();
      return foundDiscounts;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Deleted' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.discountService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
