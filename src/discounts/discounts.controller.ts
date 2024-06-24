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
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DiscountService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Discount } from './entities/discount.entity';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';
import { Roles } from '../common/decorators/roles.decorators';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Discounts')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Discount> {
    try {
      const foundDiscount = await this.discountService.findOne(id);
      if (!foundDiscount) {
        throw new HttpException(
          `Discount with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return foundDiscount;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
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
