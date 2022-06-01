import { IsNotEmpty, IsString } from "class-validator";

export class SearchUserParamDto {

	@IsString()
	@IsNotEmpty()
	query: string;

}