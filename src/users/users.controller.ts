import { GetCurrentUser, GetCurrentUserId, Public, Roles } from '@/common/decorators';
import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from './users.service';
import path = require('path');
import { Avatar } from './types';
import { GetRelationsOfUserDto, UpdateUserRoleDto, UpdateUserRoleParamDto } from './dto';
import { UserRole } from '@prisma/client';

export const storage = {
	storage: diskStorage({
		destination: './uploads/avatars',		
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

@Controller('users')
export class UsersController {

	constructor(
		private readonly usersService: UsersService
	) {}

	@Post('avatar')
	@UseInterceptors(FileInterceptor('file', storage))
	uploadAvatar(@GetCurrentUserId() userId: number, @GetCurrentUser('avatar') currentAvatar: String, @UploadedFile() file: any): Promise<Avatar> {
		return this.usersService.uploadAvatar(userId, currentAvatar, file);
	}

	@Get(':userId/relations')
	@Public()
	async getRelations(@Param() params: GetRelationsOfUserDto) {
		return this.usersService.findAllRelations(parseInt(params.userId));
	}

	@Patch(':userId/role')
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	async updateRole(@GetCurrentUserId() userId, @Param() params: UpdateUserRoleParamDto, @Body() dto: UpdateUserRoleDto) {
		return this.usersService.udpdateRole(userId, params, dto);
	}

}
