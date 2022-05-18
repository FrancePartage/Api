import { PrismaService } from "@/prisma/prisma.service"
import { computeAllUsers, computeUser } from "@/users/helpers";
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
			title: true,
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

export const paginateUsers = async (prisma: PrismaService, options: any, page: number = 1, limit: number = 10): Promise<PaginationData> => {
	if (limit > 100) limit = 100;

	const resourcesCount: number = await prisma.user.count({ ...options });
	const pageCount: number = Math.ceil(resourcesCount / limit);

	if (page > pageCount) page = pageCount;
	if (page <= 0) page = 1;

	const paginationOptions = {
		take: limit,
		skip: (page - 1) * limit
	};

	const users = await prisma.user.findMany({
		...paginationOptions,
		...options,
		select: {
			id: true,
			email: true,
			username: true,
			firstname: true,
			lastname: true,
			role: true,
			acceptRgpd: true,
			createdAt: true,
			avatar: true
		}
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

export const paginateComments = async (prisma: PrismaService, options: any, page: number = 1, limit: number = 10): Promise<PaginationData> => {
	if (limit > 100) limit = 100;

	const commentsCount: number = await prisma.comment.count({ ...options });
	const pageCount: number = Math.ceil(commentsCount / limit);

	if (page > pageCount) page = pageCount;
	if (page <= 0) page = 1;

	const paginationOptions = {
		take: limit,
		skip: (page - 1) * limit
	};

	const comments = await prisma.comment.findMany({
		...paginationOptions,
		...options,
		include: {
			author: true
		}
	});

	const computedComments = [];

	comments.map((comment: any) => {
		computedComments.push({
			...comment,
			author: computeUser(comment.author)
		});
	});

	return {
		data: computedComments,
		pagination: {
			currentPage: parseInt(page.toString()),
			limit: parseInt(limit.toString()),
			pageCount: pageCount,
			hasNextPage: page < pageCount,
			hasPreviousPage: page > 1,
			itemsCount: commentsCount
		}
	}
}

export const paginateRelations = async (prisma: PrismaService, options: any, page: number = 1, limit: number = 10): Promise<PaginationData> => {
	if (limit > 100) limit = 100;

	const relationsCount: number = await prisma.relation.count({ ...options });
	const pageCount: number = Math.ceil(relationsCount / limit);

	if (page > pageCount) page = pageCount;
	if (page <= 0) page = 1;

	const paginationOptions = {
		take: limit,
		skip: (page - 1) * limit
	};

	const relations = await prisma.relation.findMany({
		...paginationOptions,
		...options,
		include: {
			participants: true
		}
	});

	const computedRelations = [];

	relations.map((relation: any) => { 
		computedRelations.push({
			...relation,
			participants: computeAllUsers(relation.participants)
		});
	});

	return {
		data: computedRelations,
		pagination: {
			currentPage: parseInt(page.toString()),
			limit: parseInt(limit.toString()),
			pageCount: pageCount,
			hasNextPage: page < pageCount,
			hasPreviousPage: page > 1,
			itemsCount: relationsCount
		}
	}
}