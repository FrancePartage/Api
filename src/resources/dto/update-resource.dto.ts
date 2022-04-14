import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateResourceDto {

	@IsString()
	@IsOptional()
	title: string;
	
	@IsString()
	@IsOptional()
	content: string; 
	
	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	tags: string[];

}