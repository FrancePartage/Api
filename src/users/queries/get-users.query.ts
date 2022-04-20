import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class GetUsersQuery {

	@IsInt()
	@Type(() => Number)
	page: number = 1;

	@IsInt()
	@Type(() => Number)
	limit: number = 10;

	@IsString()
	@IsOptional()
	search: string;

}