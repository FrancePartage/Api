import { IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { PasswordValidation } from "class-validator-password-check/lib";

export class AuthDto {

	@IsNotEmpty()
	@IsString()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@Validate(PasswordValidation, [{
		mustContainLowerLetter: true,
		mustContainNumber: true,
		mustContainSpecialCharacter: false,
		mustContainUpperLetter: true
	}])
	password: string;

}