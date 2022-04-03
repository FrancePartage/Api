import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

type JwtPayload = {
	sub: string;
	email: string;
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {

	constructor(
		private usersService: UsersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.AT_SECRET
		});
	}

	async validate(payload: JwtPayload) {
		console.log(payload.sub);

		const user = await this.usersService.getById(parseInt(payload.sub));

		return {
			...payload,
			...user
		};
	}

}