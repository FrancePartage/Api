import { IsInt, IsNotEmpty } from "class-validator";

export class DenyRequestDto {

	@IsInt()
	@IsNotEmpty()
	requestId: number;

}