import { GetCurrentUserId } from '@/common/decorators';
import { Body, Controller, Post } from '@nestjs/common';
import { RequestDto } from './dto';
import { RelationsService } from './relations.service';

@Controller('relations')
export class RelationsController {

	constructor(
		private relationsService: RelationsService
	) {}

	@Post('request')
	request(@GetCurrentUserId() userId: number, @Body() dto: RequestDto) {
		return this.relationsService.makeRequest(userId, dto.recipientId, dto.type);
	}

}
