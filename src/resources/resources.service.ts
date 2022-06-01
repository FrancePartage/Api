import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AddResourceCommentsDto, AddResourceCommentsParamDto, CreateResourceDto, DeleteResourceCommentParamDto, DeleteResourceDto, FindResourceCommentsParamDto, LikeResourceParamDto, SearchResourceParamDto, UpdateResourceDto, UpdateResourceParamDto, UpdateResourceStatusParamDto } from './dto';
import { paginateComments, paginateResources } from '@/common/pagination/paginate';
import { ResourceStatus } from '@prisma/client';
import { computeUser } from '@/users/helpers';
import { UpdateResourceStatusDto } from './dto/update-resource-status.dto';

@Injectable()
export class ResourcesService {

	constructor(
		private prisma: PrismaService
	) {}

	async find(id: number) {
		const resource: any = await this.prisma.resource.findFirst({
			where: {
				id: id
			},
			include: {
				author: true
			}
		});

		if (resource) resource.author = await computeUser(this.prisma, resource.author);

		return {
			data: resource
		};
	}

	async searchAll(params: SearchResourceParamDto) {
		const resources = await this.prisma.resource.findMany({
			where: {
				OR: [
					{
						title: {
							contains: params.query
						}
					},
					{
						tags: {
							has: params.query
						}
					}
				],
				status: ResourceStatus.APPROVED
			},
			select: {
				id: true,
				title: true,
				authorId: true,
				status: true,
				cover: true,
				tags: true,
				createdAt: true,
				updatedAt: true,
				author: true
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: 10
		});

		const computedResources = [];

		await Promise.all(resources.map(async (resource) => {
			computedResources.push({
				...resource,
				author: await computeUser(this.prisma, resource.author)
			});
		}));

		return {
			data: computedResources
		};
	}

	async findAll(page: number, limit: number, status: ResourceStatus = ResourceStatus.APPROVED) {
		return await paginateResources(
			this.prisma, 
			{
				where: {
					status: status
				},
				orderBy: {
					createdAt: 'desc'
				}
			}, 
			page, 
			limit
		);
	}

	async create(userId: number, coverFile: any, dto: CreateResourceDto) {
		if (!coverFile) throw new ForbiddenException("Couverture non trouvée");

		return await this.prisma.resource.create({
			data: {
				authorId: userId,
				title: dto.title,
				cover: coverFile.filename,
				content: dto.content,
				tags: dto.tags
			}
		});
	}

	async delete(userId: number, dto: DeleteResourceDto) {
		const resourceId: number = parseInt(dto.id.toString());
		const resource = (await this.find(resourceId)).data;

		if (!resource) {
			throw new ForbiddenException("Ressource non trouvée");
		}

		if (resource.authorId !== userId) {
			throw new ForbiddenException("Vous n'êtes pas l'auteur de cette ressource");
		}

		 await this.prisma.resource.delete({
			where: {
				id: resourceId
			}
		});
	}

	async update(userId: number, params: UpdateResourceParamDto, dto: UpdateResourceDto) {
		const resourceId: number = parseInt(params.id.toString());
		const resource = (await this.find(resourceId)).data;
		
		if (!resource) {
			throw new ForbiddenException("Ressource non trouvée");
		}

		if (resource.authorId !== userId) {
			throw new ForbiddenException("Vous n'êtes pas l'auteur de cette ressource");
		}

		const updateOptions: any = {};

		if (dto.title) {
			updateOptions.title = dto.title;
		}

		if (dto.content) {
			updateOptions.content = dto.content;
		}

		if (dto.tags) {
			updateOptions.tags = dto.tags;
		}

		await this.prisma.resource.update({
			where: {
				id: resourceId
			},
			data: updateOptions
		});
	}

	async updateStatus(params: UpdateResourceStatusParamDto, dto: UpdateResourceStatusDto) {
		const resourceId: number = parseInt(params.id.toString());
		const resource = (await this.find(resourceId)).data;

		if (!resource) {
			throw new ForbiddenException("Ressource non trouvée");
		}

		await this.prisma.resource.update({
			where: {
				id: resourceId
			},
			data: {
				status: dto.status
			}
		});
	}

	async findPopularTags() {
		const tags = await this.prisma.$queryRaw`
			SELECT
					tag,
					COUNT(*) AS "count"
			FROM 
					"resources" AS r
			CROSS JOIN LATERAL UNNEST(r."tags") AS tags(tag)
			WHERE r.status = 'APPROVED'
			GROUP BY tag
			ORDER BY 2 DESC
			LIMIT 5
		`;

		return {
			data: tags
		}
	}

	async findByTag(tag: string, page: number, limit: number) {
		return await paginateResources(
			this.prisma, 
			{
				where: {
					status: ResourceStatus.APPROVED,
					tags: {
						has: tag
					}
				},
				orderBy: {
					createdAt: 'desc'
				}
			}, 
			page, 
			limit
		);
	}

	async createComment(userId: number, params: AddResourceCommentsParamDto, dto: AddResourceCommentsDto) {
		const resourceId: number = parseInt(params.id.toString());
		const resource = (await this.find(resourceId)).data;

		if (!resource) {
			throw new ForbiddenException("Ressource non trouvée");
		}

		const comment = await this.prisma.comment.create({
			data: {
				authorId: userId,
				resourceId: resourceId,
				content: dto.content
			},
			include: {
				author: true
			}
		});

		return {
			...comment,
			author: await computeUser(this.prisma, comment.author)
		};
	}

	async deleteComment(userId: number, params: DeleteResourceCommentParamDto) {
		const resourceId: number = parseInt(params.resourceId.toString());
		const resource = (await this.find(resourceId)).data;

		if (!resource) {
			throw new ForbiddenException("Ressource non trouvée");
		}

		const commentId: number = parseInt(params.id.toString());
		const comment = await this.prisma.comment.findFirst({
			where: {
				id: commentId
			}
		});

		if (!comment) {
			throw new ForbiddenException("Commentaire non trouvé");
		}

		if (comment.authorId !== userId) {
			throw new ForbiddenException("Vous n'êtes pas l'auteur de ce commentaire");
		}

		await this.prisma.comment.delete({
			where: {
				id: commentId
			}
		});
	}

	async findAllComments(page: number, limit: number, params: FindResourceCommentsParamDto) {
		return await paginateComments(
			this.prisma, 
			{
				where: {
					resourceId: parseInt(params.id.toString())
				},
				orderBy: {
					createdAt: 'desc'
				}
			}, 
			page, 
			limit
		);
	}

	async likeResource(userId: number, params: LikeResourceParamDto) {
		const resourceId: number = parseInt(params.id.toString());
		const resource = (await this.find(resourceId)).data;

		if (!resource) {
			throw new ForbiddenException("Ressource non trouvée");
		}

		const favoritedResource = await this.prisma.resource.findFirst({
			where: {
				id: resourceId,
				favoriteUsers: {
					some: {
						id: userId
					}
				}
			}
		});

		if (favoritedResource) {
			throw new ForbiddenException("Vous avez déjà liké cette ressource");
		}

		await this.prisma.resource.update({
			where: {
				id: resourceId
			},
			data: {
				favoriteUsers: {
					connect: {
						id: userId
					}
				}
			}
		});
	}

	async dislikeResource(userId: number, params: LikeResourceParamDto) {
		const resourceId: number = parseInt(params.id.toString());
		const resource = (await this.find(resourceId)).data;

		if (!resource) {
			throw new ForbiddenException("Ressource non trouvée");
		}

		const favoritedResource = await this.prisma.resource.findFirst({
			where: {
				id: resourceId,
				favoriteUsers: {
					some: {
						id: userId
					}
				}
			}
		});

		if (!favoritedResource) {
			throw new ForbiddenException("Vous n'avez pas liké cette ressource");
		}

		await this.prisma.resource.update({
			where: {
				id: resourceId
			},
			data: {
				favoriteUsers: {
					disconnect: {
						id: userId
					}
				}
			}
		});
	}

}
