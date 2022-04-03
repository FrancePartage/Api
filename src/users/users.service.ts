import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Role } from './models/role.model';
import { User } from './types';

@Injectable()
export class UsersService {

	constructor(
		private prisma: PrismaService
	) {}

	async findOne(userId: number): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if (!user) throw new Error("User not found");

		let displayName = '';

		if (!user['acceptRgpd'] || !user['firstname'] || !user['lastname']) {
			displayName = user['username'];
		} else {
			displayName = `${user['firstname']} ${user['lastname']}`;
		}

		return {
			displayName: displayName,
			role: Role[user['role'] as keyof Role]
		};
	}

}
