import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

	/*
	const corsOptions ={
			origin: 'http://francepartage.zapto.org', 
			credentials: true,            
			optionSuccessStatus: 200
	}
	app.use(cors(corsOptions));
	*/

	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
		next();
	});

	app.enableCors({
		allowedHeaders:"*",
		origin: "*"
	});

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3333);
}
bootstrap();
