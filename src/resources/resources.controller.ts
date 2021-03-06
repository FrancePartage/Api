import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResourcesService } from './resources.service';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { GetCurrentUser, GetCurrentUserId, MaybeAuthentificated, Public, Roles } from '@/common/decorators';
import { AddResourceCommentsDto, AddResourceCommentsParamDto, CreateResourceDto, DeleteResourceCommentParamDto, DeleteResourceDto, FindResourceCommentsParamDto, GetResourceDto, LikeResourceParamDto, SearchResourceParamDto, UpdateResourceDto, UpdateResourceParamDto, UpdateResourceStatusParamDto } from './dto';
import { GetCommentsQuery, GetResourcesQuery } from './queries';
import { ResourceStatus, UserRole } from '@prisma/client';
import { UpdateResourceStatusDto } from './dto/update-resource-status.dto';
import { userInfo } from 'os';

export const storage = {
	storage: diskStorage({
		destination: './uploads/covers',		
		filename: (req, file, cb) => {
			const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
			const extension: string = path.parse(file.originalname).ext;

			cb(null, `${filename}${extension}`);
		}
	}),
	fileFilter: (req, file, callback) => {
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			return callback(new ForbiddenException('Seulement les images sont autorisées'), false);
		}

		const fileSize = parseInt(req.headers['content-length']);
		if (fileSize > 512000) {
			return callback(new ForbiddenException('L\'image de couverture est trop volumineuse (max 512ko)'), false);
		}

		callback(null, true);
	}
}

export const storageImage = {
	storage: diskStorage({
		destination: './uploads/resources',		
		filename: (req, file, cb) => {
			const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
			const extension: string = path.parse(file.originalname).ext;

			cb(null, `${filename}${extension}`);
		}
	}),
	fileFilter: (req, file, callback) => {
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			return callback(new ForbiddenException('Seulement les images sont autorisées'), false);
		}

		const fileSize = parseInt(req.headers['content-length']);
		if (fileSize > 512000) {
			return callback(new ForbiddenException('L\'image de couverture est trop volumineuse (max 512ko)'), false);
		}

		callback(null, true);
	}
}

@Controller('resources')
export class ResourcesController {

	constructor(
		private resourcesService: ResourcesService
	) {}

	@Get('/')
	@MaybeAuthentificated()
	async findAll(@GetCurrentUser() user, @Query() queryParams: GetResourcesQuery) {
		return this.resourcesService.findAll(user, parseInt(queryParams.page.toString()), parseInt(queryParams.limit.toString()));
	}

	@Get('search/:query')
	@MaybeAuthentificated()
	async searchAll(@GetCurrentUser() user, @Param() params: SearchResourceParamDto) {
		return this.resourcesService.searchAll(user, params);
	}

	@Post('/')
	@UseInterceptors(FileInterceptor('coverFile', storage))
	async create(@GetCurrentUserId() userId: number, @UploadedFile() coverFile: any, @Body() dto: CreateResourceDto) {
		return await this.resourcesService.create(userId, coverFile, dto);
	}

	@Post('/image')
	@UseInterceptors(FileInterceptor('image', storageImage))
	async uploadImage(@UploadedFile() file: any) {
		return { file: file.filename };
	}

	@Get('first/:id')
	@MaybeAuthentificated()
	async find(@GetCurrentUser() user, @Param() params: GetResourceDto) {
		return await this.resourcesService.findMaybeAuthentificated(user, parseInt(params.id.toString()));
	}

	@Delete('first/:id')
	async delete(@GetCurrentUserId() userId: number, @Param() params: DeleteResourceDto) {
		return await this.resourcesService.delete(userId, params);
	}

	@Patch('first/:id')
	async updateOne(@GetCurrentUserId() userId: number, @Param() params: UpdateResourceParamDto, @Body() dto: UpdateResourceDto) {
		return await this.resourcesService.update(userId, params, dto);
	}

	@Patch('first/:id/status')
	@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
	async updateStatus(@Param() params : UpdateResourceStatusParamDto, @Body() dto: UpdateResourceStatusDto) {
		return await this.resourcesService.updateStatus(params, dto);
	}

	@Get('pendings')
	@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
	async findAllPendings(@Query() queryParams: GetResourcesQuery) {
		return this.resourcesService.findAll(-1, parseInt(queryParams.page.toString()), parseInt(queryParams.limit.toString()), ResourceStatus.PENDING);
	}

	@Get('tags')
	@Public()
	async findPopularTags() {
		return this.resourcesService.findPopularTags();
	}

	@Get('tags/:tag')
	@MaybeAuthentificated()
	findByTag(@GetCurrentUser() user, @Param('tag') tag: string, @Query() queryParams: GetResourcesQuery) {
		return this.resourcesService.findByTag(user, tag, queryParams.page, queryParams.limit);
	}

	@Get('first/:id/comments')
	@Public()
	findAllComments(@Query() queryParams: GetCommentsQuery, @Param() params: FindResourceCommentsParamDto) {
		return this.resourcesService.findAllComments(queryParams.page, queryParams.limit, params);
	}

	@Post('first/:id/comments')
	createComment(@GetCurrentUserId() userId: number, @Param() params: AddResourceCommentsParamDto, @Body() dto: AddResourceCommentsDto) {
		return this.resourcesService.createComment(userId, params, dto);
	}

	@Delete(':resourceId/comments/:id')
	deleteComment(@GetCurrentUserId() userId: number, @Param() params: DeleteResourceCommentParamDto) {
		return this.resourcesService.deleteComment(userId, params);
	}

	@Post('first/:id/like')
	likeResource(@GetCurrentUserId() userId: number, @Param() params: LikeResourceParamDto) {
		return this.resourcesService.likeResource(userId, params);
	}

	@Delete('first/:id/like')
	dislikeResource(@GetCurrentUserId() userId: number, @Param() params: LikeResourceParamDto) {
		return this.resourcesService.dislikeResource(userId, params);
	}

}
