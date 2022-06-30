import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

	const corsOptions ={
			origin: 'http://francepartage.zapto.org', 
			credentials: true,            
			optionSuccessStatus: 200
	}
	app.use(cors(corsOptions));

	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		next();
	});

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3333);
}
bootstrap();
