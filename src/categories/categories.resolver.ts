import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Category } from './entities/category.entity';
import { CategoryService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryDto') createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      return await this.categoryService.create(createCategoryDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Query(() => [Category], { name: 'categories' })
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Category> {
    try {
      return await this.categoryService.findOne(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCategoryDto') updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      return await this.categoryService.update(id, updateCategoryDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => Boolean)
  async removeCategory(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    try {
      await this.categoryService.remove(id);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
