import { User } from "@prisma/client";
import { ComputedUser } from "../types";

export function computeUser(user: User): ComputedUser {
		let displayName = '';

		if (!user.acceptRgpd || !user.firstname || !user.lastname) {
				displayName = user.username;
		} else {
				displayName = `${user.firstname} ${user.lastname}`;
		}
	
		return {
			displayName: displayName,
			role: user.role
		}
}

export function computeAllUsers(users: User[]): ComputedUser[] {
		return users.map(computeUser);
}