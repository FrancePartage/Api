import { Public } from '@/common/decorators';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {

	constructor(
		private assetsService: AssetsService
	) {}

	@Get('avatar/:imageName')
	@Public()
	findAvatar(@Param('imageName') imageName: string, @Res() res): Observable<Object> {
		return this.assetsService.findAvatar(imageName, res);
	}

}
