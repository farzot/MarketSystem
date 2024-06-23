import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoreController } from './stores.controller';
import { StoreService } from './stores.service';
import { User } from '../users/entities/user.entity';
import { StoreResolver } from './store.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User])],
  controllers: [StoreController],
  providers: [StoreService,StoreResolver],
  exports: [StoreService],
})
export class StoresModule {}
