import { RelationType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class MakeRequestDto {

	@IsInt()
	@IsNotEmpty()
	recipientId: number;

	@IsEnum(RelationType)
	@IsNotEmpty()
	type: RelationType;

}