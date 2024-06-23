import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrdersService) {}

  @Query(() => [Order])
  async orders(): Promise<Order[]> {
    return await this.orderService.findAll();
  }

  @Query(() => Order)
  async order(@Args('id', { type: () => Int }) id: number): Promise<Order> {
    return await this.orderService.findOne(id);
  }

  @Mutation(() => Order)
  async createOrder(
    @Args('createOrderDto') createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return await this.orderService.create(createOrderDto);
  }

  @Mutation(() => Order)
  async updateOrder(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateOrderDto') updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return await this.orderService.update(id, updateOrderDto);
  }

  @Mutation(() => Boolean)
  async removeOrder(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.orderService.remove(id);
    return true;
  }
}
