import { IsNotEmpty, IsNumberString } from "class-validator";

export class GetRelationBetweenUsersDto {

	@IsNumberString()
	@IsNotEmpty()
	userId: string;

}