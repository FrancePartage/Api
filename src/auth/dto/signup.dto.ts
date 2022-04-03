import { IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { PasswordValidation } from "class-validator-password-check/lib";

export class SignUpDto {

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@Validate(PasswordValidation, [{
		mustContainLowerLetter: true,
		mustContainNumber: true,
		mustContainSpecialCharacter: false,
		mustContainUpperLetter: true
	}])
	@MinLength(6)
	@IsString()
	@IsNotEmpty()
	password: string;

	@MinLength(3)
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	firstname: string;

	@IsString()
	@IsNotEmpty()
	lastname: string;

	@IsBoolean()
	@IsNotEmpty()
	acceptRgpd: boolean;

}