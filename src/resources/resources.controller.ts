import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResourcesService } from './resources.service';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { GetCurrentUserId, Public } from '@/common/decorators';
import { CreateResourceDto, DeleteResourceDto } from './dto';
import { GetResourcesQuery } from './queries';

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
			return callback(new ForbiddenException('L\'image est trop volumineuse (maximum 500ko)'), false);
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
	@Public()
	async findAll(@Query() queryParams: GetResourcesQuery) {
		return this.resourcesService.findAll(queryParams.page, queryParams.limit);
	}

	@Post('/')
	@UseInterceptors(FileInterceptor('coverFile', storage))
	async create(@GetCurrentUserId() userId: number, @UploadedFile() coverFile: any, @Body() dto: CreateResourceDto) {
		return await this.resourcesService.create(userId, coverFile, dto);
	}

	@Delete(':id')
	async delete(@GetCurrentUserId() userId: number, @Param() params: DeleteResourceDto) {
		return await this.resourcesService.delete(userId, params);
	}

	@Get('tags')
	@Public()
	async findPopularTags() {
		return this.resourcesService.findPopularTags();
	}

	@Get('tags/:tag')
	@Public()
	findByTag(@Param('tag') tag: string, @Query() queryParams: GetResourcesQuery) {
		return this.resourcesService.findByTag(tag, queryParams.page, queryParams.limit);
	}

}
