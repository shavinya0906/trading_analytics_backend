import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dynamoose from 'dynamoose';

function configureSwagger(app): void {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Trade Service')
    .setDescription('API Description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/trade/docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  const configService = app.get<ConfigService>(ConfigService);
  const ddb = new dynamoose.aws.ddb.DynamoDB({
    credentials: {
      accessKeyId: configService.get('aws_access_key'),
      secretAccessKey: configService.get('aws_secret_key'),
    },
    region: configService.get('aws_region'),
  });

  // Set DynamoDB instance to the Dynamoose DDB instance
  dynamoose.aws.ddb.set(ddb);
  const logger = new Logger();
  app.setGlobalPrefix('/v1/api');

  app.enableCors({ origin: '*' });

  configureSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      skipMissingProperties: true,
    }),
  );
  app.listen(configService.get('port'), () => {
    logger.log(`🚀 Trade service running on port ${configService.get('port')}`);
  });
}
bootstrap();
