import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AtGuard extends AuthGuard('jwt') {

	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride('isPublic', [
			context.getHandler(),
			context.getClass()
		]);

		const isMaybeAuthentificated = this.reflector.getAllAndOverride('isMaybeAuthentificated', [
			context.getHandler(),
			context.getClass()
		]);

		if (isPublic) return true;

		if (isMaybeAuthentificated) {
			const request = context.switchToHttp().getRequest();

			if (request.headers.authorization) {
				return super.canActivate(context);
			} else {
				return true;
			}
		}

		return super.canActivate(context);
	}

}