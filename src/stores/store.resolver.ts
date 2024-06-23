import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { StoreService } from './stores.service';
import { Store } from './entities/store.entity';
import { CreateStoreDto,  } from './dto/create-store.dto';
import {  UpdateStoreDto } from './dto/update-store.dto';

@Resolver(() => Store)
export class StoreResolver {
  constructor(private readonly storeService: StoreService) {}

  @Mutation(() => Store)
  async createStore(
    @Args('createStoreDto') createStoreDto: CreateStoreDto,
  ): Promise<Store> {
    return this.storeService.create(createStoreDto);
  }

  @Query(() => [Store], { name: 'stores' })
  async findAllStores(): Promise<Store[]> {
    return this.storeService.findAll();
  }

  @Query(() => Store, { name: 'store' })
  async findStoreById(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<Store> {
    return this.storeService.findOne(id);
  }

  @Mutation(() => Store)
  async updateStore(
    @Args('id', { type: () => ID }) id: number,
    @Args('updateStoreDto') updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    return this.storeService.update(id, updateStoreDto);
  }

  @Mutation(() => Boolean)
  async removeStore(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<boolean> {
    await this.storeService.remove(id);
    return true;
  }
}
