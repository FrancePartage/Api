import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateResourceDto } from './dto';
import { paginateResources } from '@/common/pagination/paginate';

@Injectable()
export class ResourcesService {

	constructor(
		private prisma: PrismaService
	) {}

	async findAll(page: number, limit: number) {
		return await paginateResources(
			this.prisma, 
			{}, 
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

}
