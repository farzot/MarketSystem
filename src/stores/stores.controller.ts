import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StoreService } from './stores.service';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { SuperAdminGuard } from '../common/guards/super-admin.guard';
import { UserRole } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorators';

@ApiTags('Stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({
    status: 201,
    description: 'The store has been successfully created.',
    type: Store,
  })
  async create(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    try {
      return await this.storeService.create(createStoreDto);
    } catch (error) {
      throw new BadRequestException(`Failed to create store: ${error.message}`);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all stores' })
  @ApiResponse({
    status: 200,
    description: 'Return all stores.',
    type: [Store],
  })
  async findAll(): Promise<Store[]> {
    try {
      return await this.storeService.findAll();
    } catch (error) {
      throw new NotFoundException(`Failed to find stores: ${error.message}`);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a store by ID' })
  @ApiResponse({ status: 200, description: 'Return the store.', type: Store })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  async findOne(@Param('id') id: number): Promise<Store> {
    try {
      const store = await this.storeService.findOne(id);
      if (!store) {
        throw new NotFoundException(`Store with ID ${id} not found`);
      }
      return store;
    } catch (error) {
      throw new NotFoundException(`Failed to find store: ${error.message}`);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
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
    try {
      const updatedStore = await this.storeService.update(id, updateStoreDto);
      if (!updatedStore) {
        throw new NotFoundException(`Store with ID ${id} not found`);
      }
      return updatedStore;
    } catch (error) {
      throw new NotFoundException(`Failed to update store: ${error.message}`);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a store by ID' })
  @ApiResponse({
    status: 204,
    description: 'The store has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.storeService.remove(id);
    } catch (error) {
      throw new NotFoundException(`Failed to delete store: ${error.message}`);
    }
  }
}
