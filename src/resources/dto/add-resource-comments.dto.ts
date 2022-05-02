import { IsNotEmpty, IsString } from "class-validator";

export class AddResourceCommentsDto {

  @IsString()
  @IsNotEmpty()
  content: string

}