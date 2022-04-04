import { GetCurrentUserId } from '@/common/decorators';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Relation } from '@prisma/client';
import { AcceptRequestDto, DenyRequestDto, GetRelationBetweenUsersDto, MakeRequestDto } from './dto';
import { RelationsService } from './relations.service';

@Controller('relations')
export class RelationsController {

	constructor(
		private relationsService: RelationsService
	) {}

	@Get('requests')
	getRequests(@GetCurrentUserId() userId: number): Promise<Relation[]> {
		return this.relationsService.findAll(userId);
	}

	@Get(':userId')
	async getRelationBetweenUsers(@GetCurrentUserId() userId: number, @Param() params: GetRelationBetweenUsersDto): Promise<Relation> {
		return this.relationsService.findOneBetweenUsers(userId, parseInt(params.userId));
	}

	@Post('request')
	makeRequest(@GetCurrentUserId() userId: number, @Body() dto: MakeRequestDto) {
		return this.relationsService.makeRequest(userId, dto.recipientId, dto.type);
	}

	@Patch('request/accept')
	acceptRequest(@GetCurrentUserId() userId: number, @Body() dto: AcceptRequestDto) {
		return this.relationsService.acceptRequest(userId, dto.requestId);
	}

	@Delete('request/deny')
	denyRequest(@GetCurrentUserId() userId: number, @Body() dto: DenyRequestDto) {
		return this.relationsService.denyRequest(userId, dto.requestId);
	}

}
