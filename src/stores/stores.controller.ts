import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StoreService } from './stores.service';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@ApiTags('Stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({
    status: 201,
    description: 'The store has been successfully created.',
    type: Store,
  })
  async create(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return await this.storeService.create(createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stores' })
  @ApiResponse({
    status: 200,
    description: 'Return all stores.',
    type: [Store],
  })
  async findAll(): Promise<Store[]> {
    return this.storeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a store by ID' })
  @ApiResponse({ status: 200, description: 'Return the store.', type: Store })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  async findOne(@Param('id') id: number): Promise<Store> {
    return this.storeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a store by ID' })
  @ApiResponse({
    status: 200,
    description: 'The store has been successfully updated.',
    type: Store,
  })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  async update(
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    return this.storeService.update(id, updateStoreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a store by ID' })
  @ApiResponse({
    status: 204,
    description: 'The store has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.storeService.remove(id);
  }
}
