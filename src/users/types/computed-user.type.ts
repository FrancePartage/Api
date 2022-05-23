import { UserRole } from "@prisma/client";

export type ComputedUser = {
	id: number,
	displayName: string;
	role: UserRole;
	avatar: String;
	resourcesCount: number;
	relationsCount: number;
}