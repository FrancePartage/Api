import { IsNotEmpty, IsString } from "class-validator";

export class SearchUserDto {

	@IsString()
	@IsNotEmpty()
	query: string;

}