import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { SuperAdminGuard } from '../common/guards/super-admin.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(AdminGuard)
  @Get('category-product-count/:storeId')
  @ApiOperation({ summary: 'Get category and product count by storeId' })
  @ApiParam({ name: 'storeId', type: 'number' })
  async getCategoryAndProductCount(@Param('storeId') storeId: number) {
    return this.statisticsService.getCategoryAndProductCount(storeId);
  }

  @UseGuards(AdminGuard)
  @Get('daily-sales/:storeId')
  @ApiOperation({ summary: 'Get daily sales by storeId and date' })
  @ApiParam({ name: 'storeId', type: 'number' })
  @ApiQuery({ name: 'date', type: 'string' })
  async getDailySales(
    @Param('storeId') storeId: number,
    @Query('date') date: string,
  ) {
    return this.statisticsService.getDailySales(storeId, date);
  }

  @UseGuards(AdminGuard)
  @Get('sales-by-date-range/:storeId')
  @ApiOperation({ summary: 'Get sales by date range for a store' })
  @ApiParam({ name: 'storeId', type: 'number' })
  @ApiQuery({ name: 'startDate', type: 'string' })
  @ApiQuery({ name: 'endDate', type: 'string' })
  async getSalesByDateRange(
    @Param('storeId') storeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.statisticsService.getSalesByDateRange(
      storeId,
      startDate,
      endDate,
    );
  }

  @UseGuards(SuperAdminGuard)
  @Get('store-statistics')
  @ApiOperation({ summary: 'Get statistics for all stores (super admin)' })
  async getStoreStatistics() {
    return this.statisticsService.getStoreStatistics();
  }

  @Get('top-selling-products')
  @ApiOperation({ summary: 'Get top selling products by limit' })
  @ApiQuery({ name: 'limit', type: 'number' })
  async getTopSellingProducts(@Query('limit') limit: number) {
    return this.statisticsService.getTopSellingProducts(limit);
  }
}
