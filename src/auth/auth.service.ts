import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from './dto';
import { computeUser } from '@/users/helpers';

@Injectable()
export class AuthService {

	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService
	) {}

	async signupLocal(dto: SignUpDto): Promise<Tokens> {
		const hash = await this.hashData(dto.password);

		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});

		if (user) throw new ForbiddenException("Cette adresse email est déjà utilisée");

		const newUser = await this.prisma.user.create({
			data: {
				email: dto.email,
				hash: hash,
				username: dto.username,
				firstname: dto.firstname,
				lastname: dto.lastname,
				acceptRgpd: dto.acceptRgpd
			}
		});

		const tokens = await this.getTokens(newUser.id, newUser.email);
		return tokens;
	}

	async signinLocal(dto: SignInDto): Promise<Tokens> {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});

		if (!user) throw new ForbiddenException("Accès refusé");

		const passwordMatches = await argon2.verify(user.hash, dto.password);
		if (!passwordMatches) throw new ForbiddenException("Accès refusé");
		
		const tokens = await this.getTokens(user.id, user.email);
		return tokens;
	}

	async logout(userId: number) {
		await this.prisma.user.updateMany({
			where: {
				id: userId,
				hashedRt: {
					not: null
				}
			},
			data: {
				hashedRt: null
			}
		});
	}

	async refreshTokens(userId: number, rt: string): Promise<Tokens> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if (!user || !user.hashedRt) throw new ForbiddenException("Accès refusé");

		const rtMatches = argon2.verify(user.hashedRt, rt);
		if (!rtMatches) throw new ForbiddenException("Accès refusé");

		const tokens = await this.getTokens(user.id, user.email);
		return tokens;
	}

	async me(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if (!user) throw new ForbiddenException("Accès refusé");

		return await computeUser(this.prisma, user);
	}

	async updateRtHash(userId: number, rt: string) {
		const hash = await this.hashData(rt);

		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				hashedRt: hash
			}
		});
	}

	hashData(data: string) {
		return argon2.hash(data);
	}

	async getTokens(userId: number, email: string): Promise<Tokens> {
		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: userId,
					email
				}, 
				{
					secret: process.env.AT_SECRET,
					expiresIn: 60 * 15
				}
			),
			this.jwtService.signAsync(
				{
					sub: userId,
					email
				}, 
				{
					secret: process.env.RT_SECRET,
					expiresIn: 60 * 60 * 24 * 7
				}
			)
		]);

		await this.updateRtHash(userId, rt);

		return {
			accessToken: at,
			refreshToken: rt
		}
	}

}
