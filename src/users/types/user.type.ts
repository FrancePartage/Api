import { Role } from "../models/role.model";

export type User = {
	displayName: string;
	role: Role;
}