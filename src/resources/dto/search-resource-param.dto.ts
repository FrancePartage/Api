import { IsNotEmpty, IsString } from "class-validator";

export class SearchResourceParamDto {

	@IsString()
	@IsNotEmpty()
	query: string;

}