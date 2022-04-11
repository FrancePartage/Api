import { PrismaService } from "@/prisma/prisma.service"
import { computeUser } from "@/users/helpers";
import { PaginationData } from "./types"

export const paginateResources = async (prisma: PrismaService, options: any, page: number = 1, limit: number = 10): Promise<PaginationData> => {
	if (limit > 100) limit = 100;

	const resourcesCount: number = await prisma.resource.count({ ...options });
	const pageCount: number = Math.ceil(resourcesCount / limit);

	if (page > pageCount) page = pageCount;
	if (page <= 0) page = 1;

	const paginationOptions = {
		take: limit,
		skip: (page - 1) * limit
	};

	const resources = await prisma.resource.findMany({
		...paginationOptions,
		...options,
		select: {
			id: true,
			authorId: true,
			status: true,
			cover: true,
			tags: true,
			createdAt: true,
			updatedAt: true,
			author: true
		}
	});

	const computedResources = [];

	resources.map((resource: any) => {
		computedResources.push({
			...resource,
			author: computeUser(resource.author)
		});
	});

	return {
		data: computedResources,
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