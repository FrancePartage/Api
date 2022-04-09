import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { RolesGuard } from './common/guards/roles.guard';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RelationsModule } from './relations/relations.module';
import { AssetsModule } from './assets/assets.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [
		AuthModule, 
		PrismaModule, UsersModule, RelationsModule, AssetsModule, ResourcesModule
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
