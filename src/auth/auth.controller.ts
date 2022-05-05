import { GetCurrentUser, GetCurrentUserId, Public } from '@/common/decorators';
import { RtGuard } from '@/common/guards';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {

	constructor(
		private authService: AuthService
	) {}

	@Public()
	@Post('local/signup')
	@HttpCode(HttpStatus.CREATED)
	signupLocal(@Body() dto: SignUpDto): Promise<Tokens> {
		return this.authService.signupLocal(dto);
	}

	@Public()
	@Post('local/signin')
	@HttpCode(HttpStatus.OK)
	signinLocal(@Body() dto: SignInDto): Promise<Tokens> {
		return this.authService.signinLocal(dto);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	logout(@GetCurrentUserId() userId: number) {
		return this.authService.logout(userId);
	}

	@Post('refresh')
	@Public()
	@UseGuards(RtGuard)
	@HttpCode(HttpStatus.OK)
	refreshTokens(
		@GetCurrentUserId() userId: number,
		@GetCurrentUser('refreshToken') refreshToken: string
	): Promise<Tokens> {
		return this.authService.refreshTokens(userId, refreshToken);
	}

	@Get('me')
	me(@GetCurrentUserId() userId: number) {
		return this.authService.me(userId);
	}

}
