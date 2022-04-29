import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddResourceCommentsDto {

  @IsString()
  @IsNotEmpty()
  content: string

  @IsInt()
	@IsOptional()
  parentId: number

}