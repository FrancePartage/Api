import { PrismaService } from "@/prisma/prisma.service";
import { User } from "@prisma/client";
import { ComputedUser } from "../types";

export async function computeUser(prisma: PrismaService, user: User): Promise<ComputedUser> {
		let displayName = '';

		if (!user.acceptRgpd || !user.firstname || !user.lastname) {
				displayName = user.username;
		} else {
				displayName = `${user.firstname} ${user.lastname}`;
		}

		const resourcesCount = await prisma.resource.count({
				where: {
						authorId: user.id
				}
		});

		const relationsCount = await prisma.relation.count({
				where: {
					participants: {
						some: {
							id: user.id
						}
					},
					isAccepted: true
				}
		});

		return {
			id: user.id,
			displayName: displayName,
			role: user.role,
			avatar: user.avatar,
			resourcesCount: resourcesCount,
			relationsCount: relationsCount
		}
}

export async function computeAllUsers(prisma: PrismaService, users: User[]): Promise<ComputedUser[]> {
		const computedUsers = [];

		for (const user of users) {
				computedUsers.push(await computeUser(prisma, user));
		}

		return computedUsers;
}