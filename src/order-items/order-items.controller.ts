import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemService } from './order-items.service';

@Controller('order-items')
@ApiTags('Order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiBody({ type: CreateOrderItemDto })
  @ApiResponse({
    status: 201,
    description: 'The order item has been successfully created.',
  })
  async create(@Body() createOrderItemDto: CreateOrderItemDto) {
    try {
      return await this.orderItemsService.create(createOrderItemDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all order items' })
  @ApiResponse({ status: 200, description: 'Return all order items.' })
  async findAll() {
    try {
      return await this.orderItemsService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order item by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Return the order item.' })
  @ApiResponse({ status: 404, description: 'Order item not found.' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.orderItemsService.findOne(+id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order item by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOrderItemDto })
  @ApiResponse({
    status: 200,
    description: 'The order item has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Order item not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    try {
      return await this.orderItemsService.update(+id, updateOrderItemDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order item by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 204,
    description: 'The order item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Order item not found.' })
  async remove(@Param('id') id: string) {
    try {
      await this.orderItemsService.remove(+id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
