import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class DeleteResourceDto {

	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	id: number;

}