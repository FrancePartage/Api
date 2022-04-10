import { Body, Controller, ForbiddenException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResourcesService } from './resources.service';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { GetCurrentUserId } from '@/common/decorators';
import { CreateResourceDto } from './dto';

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

	@Post('')
	@UseInterceptors(FileInterceptor('coverFile', storage))
	async create(@GetCurrentUserId() userId: number, @UploadedFile() coverFile: any, @Body() dto: CreateResourceDto) {
		return await this.resourcesService.create(userId, coverFile, dto);
	}

}
