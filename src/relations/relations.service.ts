import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Relation, RelationType } from '@prisma/client';

@Injectable()
export class RelationsService {

	constructor(
		private prisma: PrismaService,
	) {}

	async findOne(id: number) {
		const relation = await this.prisma.relation.findFirst({
			where: {
				id: id
			}
		});
		return relation;
	}

	async findOneBetweenUsers(userId: number, recipientId: number) {
		const relation = await this.prisma.relation.findFirst({
			where: {
				participants: {
					every: {
						id: {
							in: [userId, recipientId]
						}
					}
				}
			}
		});

		return relation;
	}

	async makeRequest(requesterId: number, recipientId: number, type: RelationType) {
		const relation = await this.findOneBetweenUsers(requesterId, recipientId);

		if (relation) {
			if (relation.isAccepted) {
				throw new ForbiddenException("Vous êtes déjà en relation avec cette personne");
			} else {
				throw new ForbiddenException("Vous avez déjà envoyé une demande de relation à cette personne");
			}
		}

		await this.prisma.relation.create({
			data: {
				participants: {
					connect: [
						{ id: requesterId },
						{ id: recipientId }
					]
				},
				requestTo: {
					connect: { id: recipientId }
				},
				type: type
			}
		});
	}

	async getRequests(userId: number): Promise<Relation[]> {
		const relations = await this.prisma.relation.findMany({
			where: {
				requestTo: {
					id: userId
				},
				isAccepted: false
			}
		});

		return relations;
	}

	async acceptRequest(userId: number, requestId: number) {
		const relation = await this.findOne(requestId);

		if (!relation) {
			throw new ForbiddenException("Cette demande n'existe pas");
		}

		if (relation.requestToId !== userId) {
			throw new ForbiddenException("Vous n'avez pas la permission d'accepter cette demande");
		}

		if (relation.isAccepted) {
			throw new ForbiddenException("Cette demande a déjà été acceptée");
		}

		await this.prisma.relation.update({
			where: {
				id: relation.id
			},
			data: {
				isAccepted: true
			}
		});
	}

}