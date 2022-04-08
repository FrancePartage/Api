import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { computeUser } from './helpers';
import { Avatar, ComputedUser } from './types';
import fs = require('fs');

@Injectable()
export class UsersService {

	constructor(
		private prisma: PrismaService
	) {}

	async findOne(userId: number): Promise<ComputedUser> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if (!user) throw new Error("User not found");

		return computeUser(user);
	}

	async uploadAvatar(userId: number, currentAvatar: String, file: any): Promise<Avatar> {
		if (!file) throw new ForbiddenException("Fichier non trouvé");

		if (currentAvatar !== "default.png") {
			fs.unlinkSync(`./uploads/avatars/${currentAvatar}`);
		}

		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				avatar: file.filename
			}
		});

		return {
			imagePath: file.filename
		};
	}

}
