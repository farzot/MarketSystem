import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryController } from './categories.controller';
import { CategoryService } from './categories.service';
import { Store } from '../stores/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category,Store])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService], // If needed to be exported for other modules
})
export class CategoriesModule {}
