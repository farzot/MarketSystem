import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { LoggerFactory } from './logger/factory';
import * as bodyParser from 'body-parser';
import { GraphQLModule } from '@nestjs/graphql';

async function start() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: LoggerFactory('MarketSystem'),
    });
    app.use(bodyParser.json({ type: 'application/json' }));

    const config = app.get(ConfigService);
    const PORT = config.get<number>('API_PORT');
    app.setGlobalPrefix('api');
    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe());
    const doc = new DocumentBuilder()
      .setTitle('Test project')
      .setDescription('Platform for market systems')
      .setVersion('1.0')
      .addTag(
        `
          NodeJS, Validation, Postgres, JWT, GraphQL Swagger, TypeORM, NestJS
      `,
      )
      .build();
    const document = SwaggerModule.createDocument(app, doc);
    SwaggerModule.setup('api/docs', app, document);
     await app.get(GraphQLModule);
    await app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    throw error;
  }
}
start();
