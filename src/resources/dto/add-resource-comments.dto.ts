import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddResourceCommentsDto {

  @IsString()
  @IsNotEmpty()
  content: string

	@IsNumber()
	@IsOptional()
	parentId: number;

}