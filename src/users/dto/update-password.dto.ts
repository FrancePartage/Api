import { IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { PasswordValidation } from "class-validator-password-check/lib";

export class UpdatePasswordDto {

	@IsString()
	@IsNotEmpty()
	oldPassword: string;

	@Validate(PasswordValidation, [{
		mustContainLowerLetter: true,
		mustContainNumber: true,
		mustContainSpecialCharacter: false,
		mustContainUpperLetter: true
	}])
	@MinLength(6)
	@IsString()
	@IsNotEmpty()
	newPassword: string;

}