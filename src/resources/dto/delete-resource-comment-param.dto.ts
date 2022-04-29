import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class DeleteResourceCommentParamDto {

	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	resourceId: number;

	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	id: number;

}