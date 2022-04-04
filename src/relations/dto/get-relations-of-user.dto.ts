import { IsNotEmpty, IsNumberString } from "class-validator";

export class GetRelationsOfUserDto {

	@IsNumberString()
	@IsNotEmpty()
	userId: string;

}