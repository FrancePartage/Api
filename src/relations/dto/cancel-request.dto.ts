import { IsInt, IsNotEmpty } from "class-validator";

export class CancelRequestDto {

	@IsInt()
	@IsNotEmpty()
	requestId: number;

}