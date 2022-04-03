import { Role } from "../models/role.model";

export type User = {
	firstName: string;
	lastName: string;
	role: Role;
}