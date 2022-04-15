import { PrismaService } from '@/prisma/prisma.service';
import { computeAllUsers } from '@/users/helpers';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Relation, RelationType } from '@prisma/client';

@Injectable()
export class RelationsService {

	constructor(
		private prisma: PrismaService
	) {}

	async findOne(id: number): Promise<Relation> {
		const relation = await this.prisma.relation.findFirst({
			where: {
				id: id
			}
		});
		return relation;
	}

	async findOneIncludeParticipants(id: number) {
		const relation = await this.prisma.relation.findFirst({
			where: {
				id: id
			},
			include: {
				participants: true
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

		return {
			data: relation
		};
	}

	async remove(userId: number, relationId: number) {
		const relation = await this.findOneIncludeParticipants(relationId);

		if (!relation) {
			throw new ForbiddenException("Cette relation n'existe pas");
		}

		if (!relation.participants.find(x => x.id === userId)) {
			throw new ForbiddenException("Vous n'avez pas la permission de supprimer cette relation");
		}

		if (!relation.isAccepted) {
			throw new ForbiddenException("Cette relation n'est pas encore acceptée");
		}

		await this.prisma.relation.delete({
			where: {
				id: relation.id
			}
		});
	}

	async makeRequest(requesterId: number, recipientId: number, type: RelationType) {
		const relation = (await this.findOneBetweenUsers(requesterId, recipientId)).data;

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

	async findAllRequests(userId: number) {
		const relations = await this.prisma.relation.findMany({
			where: {
				requestTo: {
					id: userId
				},
				isAccepted: false
			}
		});

		return {
			data: relations
		};
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

	async denyRequest(userId: number, requestId: number) {
		const relation = await this.findOne(requestId);

		if (!relation) {
			throw new ForbiddenException("Cette demande n'existe pas");
		}

		if (relation.requestToId !== userId) {
			throw new ForbiddenException("Vous n'avez pas la permission de refuser cette demande");
		}

		if (relation.isAccepted) {
			throw new ForbiddenException("Cette demande a déjà été acceptée");
		}

		await this.prisma.relation.delete({
			where: {
				id: relation.id
			}
		});
	}

	async cancelRequest(userId: number, requestId: number) {
		const relation = await this.findOneIncludeParticipants(requestId);

		if (!relation) {
			throw new ForbiddenException("Cette demande n'existe pas");
		}

		if (!relation.participants.find(x => x.id === userId)) {
			throw new ForbiddenException("Vous n'avez pas la permission de supprimer cette demande");
		}

		if (relation.requestToId === userId) {
			throw new ForbiddenException("Vous n'avez pas la permission de supprimer cette demande");
		}

		if (relation.isAccepted) {
			throw new ForbiddenException("Cette demande a déjà été acceptée");
		}

		await this.prisma.relation.delete({
			where: {
				id: relation.id
			}
		});
	}

	async findSuggestions(userId: number) {
		const relations = await this.prisma.user.findMany({
			where: {
				relations: {
					every: {
						participants: {
							every: {
								id: {
									not: userId
								}
							}
						}
					}
				},
				NOT: {
					id: userId
				}
			},
			take: 5
		});

		return {
			data: relations
		}
	}

}
