import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { StatisticsService } from './statistics.service';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

@Resolver()
export class StatisticsResolver {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Query(() => Int)
  async categoryCount(@Args('storeId', { type: () => Int }) storeId: number) {
    const result =
      await this.statisticsService.getCategoryAndProductCount(storeId);
    return result.categoryCount;
  }

  @Query(() => Int)
  async productCount(@Args('storeId', { type: () => Int }) storeId: number) {
    const result =
      await this.statisticsService.getCategoryAndProductCount(storeId);
    return result.productCount;
  }

  @Query(() => [Product])
  async topSellingProducts(@Args('limit', { type: () => Int }) limit: number) {
    return this.statisticsService.getTopSellingProducts(limit);
  }

  @Query(() => [Order])
  async dailySales(
    @Args('storeId', { type: () => Int }) storeId: number,
    @Args('date', { type: () => String }) date: string,
  ) {
    return this.statisticsService.getDailySales(storeId, date);
  }

  @Query(() => [Order])
  async salesByDateRange(
    @Args('storeId', { type: () => Int }) storeId: number,
    @Args('startDate', { type: () => String }) startDate: string,
    @Args('endDate', { type: () => String }) endDate: string,
  ) {
    return this.statisticsService.getSalesByDateRange(
      storeId,
      startDate,
      endDate,
    );
  }

  @Query(() => Int)
  async totalStores() {
    const result = await this.statisticsService.getStoreStatistics();
    return result.totalStores;
  }

  @Query(() => Object)
  async storeDetails() {
    const result = await this.statisticsService.getStoreStatistics();
    return result.storeDetails;
  }
}
