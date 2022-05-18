import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class GetUserResourcesQuery {

	@IsInt()
	@Type(() => Number)
	page: number = 1;

	@IsInt()
	@Type(() => Number)
	limit: number = 10;

}