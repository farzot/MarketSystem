import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { UserRole } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorators';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('category-product-count/:storeId')
  @ApiOperation({ summary: 'Get category and product count by storeId' })
  @ApiParam({ name: 'storeId', type: 'number' })
  async getCategoryAndProductCount(@Param('storeId') storeId: number) {
    try {
      return await this.statisticsService.getCategoryAndProductCount(storeId);
    } catch (error) {
      throw new NotFoundException(
        `Failed to fetch category and product count: ${error.message}`,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('daily-sales/:storeId')
  @ApiOperation({ summary: 'Get daily sales by storeId and date' })
  @ApiParam({ name: 'storeId', type: 'number' })
  @ApiQuery({ name: 'date', type: 'string' })
  async getDailySales(
    @Param('storeId') storeId: number,
    @Query('date') date: string,
  ) {
    try {
      return await this.statisticsService.getDailySales(storeId, date);
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch daily sales: ${error.message}`,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
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
    try {
      return await this.statisticsService.getSalesByDateRange(
        storeId,
        startDate,
        endDate,
      );
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch sales by date range: ${error.message}`,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('store-statistics')
  @ApiOperation({ summary: 'Get statistics for all stores (super admin)' })
  async getStoreStatistics() {
    try {
      return await this.statisticsService.getStoreStatistics();
    } catch (error) {
      throw new NotFoundException(
        `Failed to fetch store statistics: ${error.message}`,
      );
    }
  }

  @Get('top-selling-products')
  @ApiOperation({ summary: 'Get top selling products by limit' })
  @ApiQuery({ name: 'limit', type: 'number' })
  async getTopSellingProducts(@Query('limit') limit: number) {
    try {
      return await this.statisticsService.getTopSellingProducts(limit);
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch top selling products: ${error.message}`,
      );
    }
  }
}
