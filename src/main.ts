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

  const options = {
    "origin":true,  // attempted "origin":["http://localhost"]
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 200,
    "credentials":true,
    "allowedHeaders": "Content-Type, Accept,Authorization",

  }
 app.use(cors(options));

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3333);
}
bootstrap();
