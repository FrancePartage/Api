import { Role } from "@/users/models/role.model";
import { SetMetadata } from "@nestjs/common";

export const Roles = (role: Role) => SetMetadata("role", role);