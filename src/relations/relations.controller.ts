import { GetCurrentUserId } from '@/common/decorators';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Relation } from '@prisma/client';
import { AcceptRequestDto, CancelRequestDto, DenyRequestDto, GetRelationBetweenUsersDto, MakeRequestDto, RemoveRequestDto } from './dto';
import { RelationsService } from './relations.service';

@Controller('relations')
export class RelationsController {

	constructor(
		private relationsService: RelationsService
	) {}

	@Delete('/')
	removeRequest(@GetCurrentUserId() userId: number, @Body() dto: RemoveRequestDto) {
		return this.relationsService.remove(userId, dto.requestId);
	}

	@Get('user/:userId')
	async getRelationBetweenUsers(@GetCurrentUserId() userId: number, @Param() params: GetRelationBetweenUsersDto) {
		return this.relationsService.findOneBetweenUsers(userId, parseInt(params.userId));
	}

	@Get('requests')
	getRequests(@GetCurrentUserId() userId: number) {
		return this.relationsService.findAllRequests(userId);
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

	@Delete('request/cancel')
	cancelRequest(@GetCurrentUserId() userId: number, @Body() dto: CancelRequestDto) {
		return this.relationsService.cancelRequest(userId, dto.requestId);
	}

	@Get('suggestions')
	async findSuggestions(@GetCurrentUserId() userId: number) {
		return this.relationsService.findSuggestions(userId);
	}

}
