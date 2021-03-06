import { GetCurrentUser, GetCurrentUserId, MaybeAuthentificated, Public, Roles } from '@/common/decorators';
import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from './users.service';
import path = require('path');
import { Avatar } from './types';
import { GetFavoritesParamDto, GetRelationsOfUserDto, SearchUserParamDto, UpdateInformationsDto, UpdatePasswordDto, UpdateUserRoleDto, UpdateUserRoleParamDto } from './dto';
import { UserRole } from '@prisma/client';
import { GetFavoritesQuery, GetUserRelationsQuery, GetUserResourcesQuery, GetUsersQuery } from './queries';
import { GetUserInformations } from './dto/get-user-informations.dto';
import { GetResourcesOfUserDto } from './dto/get-resources-of-user.dto';

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

	@Get('')
	@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
	findAll(@Query() queryParams: GetUsersQuery) {
		return this.usersService.findAll(parseInt(queryParams.page.toString()), parseInt(queryParams.limit.toString()), queryParams.search);
	}

	@Get('search/:query')
	@Public()
	searchAll(@Param() params: SearchUserParamDto) {
		return this.usersService.searchAll(params);
	}

	@Post('avatar')
	@UseInterceptors(FileInterceptor('file', storage))
	uploadAvatar(@GetCurrentUserId() userId: number, @GetCurrentUser('avatar') currentAvatar: String, @UploadedFile() file: any): Promise<Avatar> {
		return this.usersService.uploadAvatar(userId, currentAvatar, file);
	}

	@Get(':userId')
	@Public()
	async getUserInformation(@Param() params: GetUserInformations) {
		return this.usersService.findOne(parseInt(params.userId));
	}

	@Get(':userId/relations')
	@Public()
	async getRelations(@Param() params: GetRelationsOfUserDto, @Query() query: GetUserRelationsQuery) {
		return this.usersService.findAllRelations(parseInt(params.userId), query.page, query.limit);
	}

	@Get(':userId/resources')
	@MaybeAuthentificated()
	async getResources(@GetCurrentUser() user, @Param() params: GetResourcesOfUserDto, @Query() query: GetUserResourcesQuery) {
		return this.usersService.findAllResources(user, parseInt(params.userId), query.page, query.limit);
	}

	@Patch(':userId/role')
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	async updateRole(@GetCurrentUserId() userId, @Param() params: UpdateUserRoleParamDto, @Body() dto: UpdateUserRoleDto) {
		return this.usersService.udpdateRole(userId, params, dto);
	}

	@Patch('password')
	async updatePassword(@GetCurrentUserId() userId: number, @Body() dto: UpdatePasswordDto) {
		return this.usersService.updatePassword(userId, dto);
	}

	@Patch('informations')
	async updateInformations(@GetCurrentUserId() userId: number, @Body() dto: UpdateInformationsDto) {
		return this.usersService.updateInformations(userId, dto);
	}

	@Get(':userId/favorites')
	@Public()
	async findAllFavorites(@GetCurrentUser() user, @Param() params: GetFavoritesParamDto, @Query() queryParams: GetFavoritesQuery) {
		return this.usersService.findAllFavorites(user, parseInt(params.userId), queryParams.page, queryParams.limit);
	}

}
