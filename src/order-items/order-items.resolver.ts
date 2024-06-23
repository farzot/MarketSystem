import { Controller } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemService } from './order-items.service';
import { OrderItem } from './entities/order-item.entity';

@Resolver(() => OrderItem)
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemService) {}

  @Mutation(() => OrderItem)
  createOrderItem(
    @Args('createOrderItemDto') createOrderItemDto: CreateOrderItemDto,
  ) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Query(() => [OrderItem], { name: 'orderItems' })
  findAllOrderItems() {
    return this.orderItemsService.findAll();
  }

  @Query(() => OrderItem, { name: 'orderItem' })
  findOneOrderItem(@Args('id', { type: () => ID }) id: string) {
    return this.orderItemsService.findOne(+id);
  }

  @Mutation(() => OrderItem)
  updateOrderItem(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateOrderItemDto') updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(+id, updateOrderItemDto);
  }

  @Mutation(() => OrderItem)
  removeOrderItem(@Args('id', { type: () => ID }) id: string) {
    return this.orderItemsService.remove(+id);
  }
}
