import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumberString } from "class-validator";

export class DeleteResourceDto {

	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	id: number;

}