import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

	const corsOptions ={
			origin:'http://localhost:3000', 
			credentials:true,            //access-control-allow-credentials:true
			optionSuccessStatus:200
	}
	app.use(cors(corsOptions));

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3333);
}
bootstrap();
