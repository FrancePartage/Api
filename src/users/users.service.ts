import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Role } from './models/role.model';
import { User } from './types';

@Injectable()
export class UsersService {

	constructor(
		private prisma: PrismaService
	) {}

	async getById(userId: number): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if (!user) throw new Error("User not found");

		return {
			firstName: '',
			lastName: '',
			role: Role[user['role'] as keyof Role]
		};
	}

}
