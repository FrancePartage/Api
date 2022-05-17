import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class GetUserInformations {

	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	userId: string;

}