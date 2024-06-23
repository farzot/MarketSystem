import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // async create(createOrderDto: CreateOrderDto): Promise<Order> {
  //   const { cashierId, payment_method, items } = createOrderDto;

  //   const orderItems = [];
  //   let totalAmount = 0;

  //   for (const item of items) {
  //     const product = await this.productRepository.findOne({
  //       where: { id: item.productId },
  //     });
  //     if (!product) {
  //       throw new NotFoundException(
  //         `Product with ID ${item.productId} not found`,
  //       );
  //     }
  //     const orderItem = new OrderItem();
  //     orderItem.product = product;
  //     orderItem.quantity = item.quantity;

  //     orderItems.push(orderItem);
  //     totalAmount += product.sale_price * item.quantity;
  //   }

  //   const order = new Order();
  //   order.cashierId = cashierId;
  //   order.date = new Date().toISOString().split('T')[0];
  //   order.payment_method = payment_method;
  //   order.total_amount = totalAmount;
  //   order.items = orderItems;

  //   return this.orderRepository.save(order);
  // }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { cashierId, payment_method, items } = createOrderDto;

    // Calculate total amount and validate product quantities
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      // Check if requested quantity exceeds available stock
      if (item.quantity > product.amount) {
        throw new Error(
          `Not enough stock for product with ID ${item.productId}`,
        );
      }

      // Create order item
      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.quantity = item.quantity;
      orderItems.push(orderItem);

      // Calculate total amount for the order
      totalAmount += product.sale_price * item.quantity;
    }

    // Create the order entity
    const order = new Order();
    order.cashierId = cashierId;
    order.date = new Date().toISOString().split('T')[0];
    order.payment_method = payment_method;
    order.total_amount = totalAmount;
    order.items = orderItems;

    // Save order and update product quantities
    const savedOrder = await this.orderRepository.save(order);

    // Deduct ordered quantities from product stock
    for (const item of orderItems) {
      item.product.sold_amount += item.quantity;
      item.product.amount -= item.quantity;
      await this.productRepository.save(item.product);
    }

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['items', 'items.product'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { cashierId, payment_method } = updateOrderDto;

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.cashierId = cashierId;
    order.payment_method = payment_method;

    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await this.orderRepository.remove(order);
  }
}
