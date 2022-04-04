import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {

	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requireRoles = this.reflector.getAllAndOverride<UserRole>("roles", [
			context.getHandler(),
			context.getClass()
		]);
		
		if (!requireRoles) return true;

		const user = context.switchToHttp().getRequest().user;
		if (!user) return false;

		return requireRoles.includes(user.role);
	}

}