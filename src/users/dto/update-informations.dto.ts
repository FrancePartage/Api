import { IsNotEmpty, IsString } from "class-validator";

export class UpdateInformationsDto {

	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	firstname: string;

	@IsString()
	@IsNotEmpty()
	lastname: string;

}