import { GetCurrentUserId } from '@/common/decorators';
import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { Relation } from '@prisma/client';
import { AcceptRequestDto, MakeRequestDto } from './dto';
import { RelationsService } from './relations.service';

@Controller('relations')
export class RelationsController {

	constructor(
		private relationsService: RelationsService
	) {}

	@Post('request')
	request(@GetCurrentUserId() userId: number, @Body() dto: MakeRequestDto) {
		return this.relationsService.makeRequest(userId, dto.recipientId, dto.type);
	}

	@Get('requests')
	requests(@GetCurrentUserId() userId: number): Promise<Relation[]> {
		return this.relationsService.getRequests(userId);
	}

	@Patch('request/accept')
	acceptRequest(@GetCurrentUserId() userId: number, @Body() dto: AcceptRequestDto) {
		return this.relationsService.acceptRequest(userId, dto.requestId);
	}

}
