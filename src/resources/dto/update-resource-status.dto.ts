import { ResourceStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UpdateResourceStatusDto {

	@IsEnum(ResourceStatus)
	@IsNotEmpty()
	status: ResourceStatus;

}