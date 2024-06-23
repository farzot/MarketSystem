import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Store } from '../stores/entities/store.entity';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    
  ) {}

  // bu admin uchun category va product soni
  async getCategoryAndProductCount(
    storeId: number,
  ): Promise<{ categoryCount: number; productCount: number }> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['categories', 'products'],
    });

    if (!store) {
      throw new Error('Store not found');
    }

    const categoryCount = store.categories ? store.categories.length : 0;
    const productCount = store.products ? store.products.length : 0;

    return {
      categoryCount,
      productCount,
    };
  }

  // bu admin uchun kunlik savdo
  async getDailySales(
    storeId: number,
    date: string,
  ): Promise<{ cashSales: number; cardSales: number; totalSales: number }> {
    const orders = await this.orderRepository.find({
      where: {
        date: date,
        store: { id: storeId },
      },
    });

    let cashSales = 0;
    let cardSales = 0;
    let totalSales = 0;

    orders.forEach((order) => {
      if (order.payment_method === 'cash') {
        cashSales += order.total_amount;
      } else if (order.payment_method === 'card') {
        cardSales += order.total_amount;
      }
      totalSales += order.total_amount;
    });

    return {
      cashSales,
      cardSales,
      totalSales,
    };
  }

  // bu admin uchun 2 ta kun orasidagi savdo hajmi
  async getSalesByDateRange(
    storeId: number,
    startDate: string,
    endDate: string,
  ): Promise<{ cashSales: number; cardSales: number; totalSales: number }> {
    const orders = await this.orderRepository.find({
      where: {
        date: Between(startDate, endDate),
        store: { id: storeId },
      },
    });

    let cashSales = 0;
    let cardSales = 0;
    let totalSales = 0;

    orders.forEach((order) => {
      if (order.payment_method === 'cash') {
        cashSales += order.total_amount;
      } else if (order.payment_method === 'card') {
        cardSales += order.total_amount;
      }
      totalSales += order.total_amount;
    });

    return {
      cashSales,
      cardSales,
      totalSales,
    };
  }

  // bu super_admin uchun
  async getStoreStatistics(): Promise<{
    totalStores: number;
    storeDetails: {
      storeId: number;
      storeName: string;
      categoryCount: number;
      productCount: number;
    }[];
  }> {
    const stores = await this.storeRepository.find({
      relations: ['categories', 'products'],
    });

    const totalStores = stores.length;

    const storeDetails = stores.map((store) => ({
      storeId: store.id,
      storeName: store.name,
      categoryCount: store.categories ? store.categories.length : 0,
      productCount: store.products ? store.products.length : 0,
    }));

    return {
      totalStores,
      storeDetails,
    };
  }

  // bu eng ommabop productlarni qo'yilgan limit bo'yicha reytingda chiqarib beradi
  async getTopSellingProducts(limit: number): Promise<Product[]> {
    const products = await this.productRepository.find({
      order: {
        sold_amount: 'DESC',
      },
      take: limit,
    });

    return products;
  }
}

 
  