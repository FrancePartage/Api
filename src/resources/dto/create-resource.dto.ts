import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateResourceDto {

	@IsString()
	@IsNotEmpty()
	title: string;
	
	@IsString()
	@IsNotEmpty()
	content: string; 
	
	@IsString({ each: true })
	@IsArray()
	@IsNotEmpty()
	tags: string[];

}