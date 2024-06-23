import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const { orderId, productId, quantity } = createOrderItemDto;

    // Ensure order and product exist
    // Note: You should implement appropriate error handling based on your application logic
    // For brevity, error handling is kept minimal in this example.
    const orderItem = this.orderItemRepository.create({
      order: { id: orderId }, // Assuming orderId is the ID of an existing Order
      product: { id: productId }, // Assuming productId is the ID of an existing Product
      quantity,
    });

    return await this.orderItemRepository.save(orderItem);
  }

  async findAll(): Promise<OrderItem[]> {
    return await this.orderItemRepository.find();
  }

  async findOne(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({where: {id}});
    if (!orderItem) {
      throw new NotFoundException(`Order Item with ID ${id} not found`);
    }
    return orderItem;
  }

  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({where: {id}});
    if (!orderItem) {
      throw new NotFoundException(`Order Item with ID ${id} not found`);
    }

    // Update properties based on DTO
    const { quantity } = updateOrderItemDto;
    orderItem.quantity = quantity;

    return await this.orderItemRepository.save(orderItem);
  }

  async remove(id: number): Promise<void> {
    const orderItem = await this.orderItemRepository.findOne({where: {id}});
    if (!orderItem) {
      throw new NotFoundException(`Order Item with ID ${id} not found`);
    }

    await this.orderItemRepository.delete(id);
  }
}
