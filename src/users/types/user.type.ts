import { UserRole } from "@prisma/client";

export type User = {
	displayName: string;
	role: UserRole;
}