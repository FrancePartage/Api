import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class LikeResourceParamDto {

	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	id: number;

}