import { IsNotEmpty, IsString } from "class-validator";

export class SearchResourceDto {

	@IsString()
	@IsNotEmpty()
	query: string;

}