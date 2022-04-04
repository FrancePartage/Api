import { IsInt, IsNotEmpty } from "class-validator";

export class RemoveRequestDto {

	@IsInt()
	@IsNotEmpty()
	requestId: number;

}