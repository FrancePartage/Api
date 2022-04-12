import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateResourceDto, DeleteResourceDto } from './dto';
import { paginateResources } from '@/common/pagination/paginate';
import { ResourceStatus } from '@prisma/client';
import { computeUser } from '@/users/helpers';

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

		resource.author = computeUser(resource.author);

		return {
			data: resource
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

}
