import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateResourceDto } from './dto';
import { paginateResources } from '@/common/pagination/paginate';
import { ResourceStatus } from '@prisma/client';

@Injectable()
export class ResourcesService {

	constructor(
		private prisma: PrismaService
	) {}

	async findAll(page: number, limit: number) {
		return await paginateResources(
			this.prisma, 
			{
				where: {
					status: ResourceStatus.APPROVED
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

	async findPopularTags() {
		const tags = await this.prisma.$queryRaw`
			SELECT
					tag,
					COUNT(*) AS "count"
			FROM 
					"resources" AS s
			CROSS JOIN LATERAL UNNEST(s."tags") AS tags(tag)
			GROUP BY
					tag
			ORDER BY 2 DESC
			LIMIT 5
		`;

		return {
			data: tags
		}
	}

}
