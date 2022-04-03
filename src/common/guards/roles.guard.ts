import { Role } from "@/users/models/role.model";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {

	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requireRole = this.reflector.getAllAndOverride<Role>("role", [
			context.getHandler(),
			context.getClass()
		]);

		if (!requireRole && requireRole !== 0) return true;

		const user = context.switchToHttp().getRequest().user;
		if (!user) return false;
		return user.role <= requireRole;
	}

}