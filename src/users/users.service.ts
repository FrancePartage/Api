import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { computeAllUsers, computeUser } from './helpers';
import { Avatar, ComputedUser } from './types';
import fs = require('fs');
import * as argon2 from 'argon2';
import { UpdateInformationsDto, UpdatePasswordDto, UpdateUserRoleDto, UpdateUserRoleParamDto } from './dto';

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

	async findAllRelations(userId: number) {
		const relations = await this.prisma.relation.findMany({
			where: {
				participants: {
					some: {
						id: userId
					}
				},
				isAccepted: true
			},
			include: {
				participants: true
			}
		});
		
		const computedRelations = [];

		relations.map(relation => { 
			computedRelations.push({
				...relation,
				participants: computeAllUsers(relation.participants)
			});
		});

		return {
			data: computedRelations
		};
	}

	async udpdateRole(currentUserId: number, params: UpdateUserRoleParamDto, dto: UpdateUserRoleDto) {
		const userId = parseInt(params.userId.toString());
		const user = await this.findOne(userId);

		if (!user) throw new Error("User not found");
		if (currentUserId === userId) throw new Error("Vous ne pouvez pas changer votre propre rôle");

		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				role: dto.role
			}
		});
	}

	async updatePassword(userId: number, dto: UpdatePasswordDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if (!user) throw new ForbiddenException("Accès refusé");

		const passwordMatches = await argon2.verify(user.hash, dto.oldPassword);
		if (!passwordMatches) throw new ForbiddenException("Votre mot de passe est incorrect");

		const hash = await argon2.hash(dto.newPassword);

		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				hash: hash
			}
		});
	}

	async updateInformations(userId: number, dto: UpdateInformationsDto) {
		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				firstname: dto.firstname,
				lastname: dto.lastname,
				username: dto.username
			}
		});
	}

}
