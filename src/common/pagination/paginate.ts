import { PrismaService } from "@/prisma/prisma.service"
import { PaginationData } from "./types"

export const paginateResources = async (prisma: PrismaService, options: any, page: number = 1, limit: number = 10): Promise<PaginationData> => {
	if (limit > 100) limit = 100;

	const resourcesCount: number = await prisma.resource.count();
	const pageCount: number = Math.ceil(resourcesCount / limit);

	if (page > pageCount) page = pageCount;
	if (page <= 0) page = 1;

	const paginationOptions = {
		take: limit,
		skip: (page - 1) * limit
	};

	const users = await prisma.resource.findMany({
		...paginationOptions,
		...options
	});

	return {
		data: users,
		pagination: {
			currentPage: parseInt(page.toString()),
			limit: parseInt(limit.toString()),
			pageCount: pageCount,
			hasNextPage: page < pageCount,
			hasPreviousPage: page > 1,
			itemsCount: resourcesCount
		}
	}
}