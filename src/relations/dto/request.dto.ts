import { RelationType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class RequestDto {

	@IsInt()
	@IsNotEmpty()
	recipientId: number;

	@IsEnum(RelationType)
	@IsNotEmpty()
	type: RelationType;

}