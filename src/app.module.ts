import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { RolesGuard } from './common/guards/roles.guard';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
		AuthModule, 
		PrismaModule, UsersModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AtGuard,
		}, 
		{
			provide: APP_GUARD,
			useClass: RolesGuard
		}
	]
})

export class AppModule {}
