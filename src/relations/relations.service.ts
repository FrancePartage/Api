import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { RelationType } from '@prisma/client';

@Injectable()
export class RelationsService {

	constructor(
		private prisma: PrismaService,
	) {}

	async findOne(userId: number, recipientId: number) {
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
		const relation = await this.findOne(requesterId, recipientId);

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

}
