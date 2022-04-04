import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { computeUser } from './helpers';
import { ComputedUser } from './types';

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

}
