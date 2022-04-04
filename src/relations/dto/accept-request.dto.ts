import { IsInt, IsNotEmpty } from "class-validator";

export class AcceptRequestDto {

	@IsInt()
	@IsNotEmpty()
	requestId: number;

}