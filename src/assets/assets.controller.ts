import { Public } from '@/common/decorators';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {

	constructor(
		private assetsService: AssetsService
	) {}

	@Get('avatars/:imageName')
	@Public()
	findAvatar(@Param('imageName') imageName: string, @Res() res): Observable<Object> {
		return this.assetsService.findAvatar(imageName, res);
	}

	@Get('covers/:imageName')
	@Public()
	findCover(@Param('imageName') imageName: string, @Res() res): Observable<Object> {
		return this.assetsService.findCover(imageName, res);
	}

	@Get('resources/:imageName')
	@Public()
	findResources(@Param('imageName') imageName: string, @Res() res): Observable<Object> {
		return this.assetsService.findResource(imageName, res);
	}

}
