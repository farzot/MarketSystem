import { InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber } from "class-validator";

@InputType()
export class UpdateDiscountDto {
  @ApiProperty()
  @IsNumber()
  discount_price: number;

  @ApiProperty()
//   @IsDate()
  start_date: Date;

  @ApiProperty()
//   @IsDate()
  end_date: Date;
}
