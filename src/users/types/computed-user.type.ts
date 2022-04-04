import { UserRole } from "@prisma/client";

export type ComputedUser = {
	displayName: string;
	role: UserRole;
}