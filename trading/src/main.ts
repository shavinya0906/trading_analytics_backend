// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { Logger, ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as dynamoose from 'dynamoose';

// function configureSwagger(app): void {
//   const config = new DocumentBuilder()
//     .addBearerAuth()
//     .setTitle('Trade Service')
//     .setDescription('API Description')
//     .setVersion('1.0')
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('/trade/docs', app, document);
// }

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
//   const configService = app.get<ConfigService>(ConfigService);
//   console.log(configService.get('aws_access_key'));
//   console.log(configService.get('aws_secret_key'));
//   console.log(configService.get('aws_region'));
//   const ddb = new dynamoose.aws.ddb.DynamoDB({
//     credentials: {
//       accessKeyId: configService.get('aws_access_key'),
//       secretAccessKey: configService.get('aws_secret_key'),
//     },
//     region: configService.get('aws_region'),
//   });

//   // Set DynamoDB instance to the Dynamoose DDB instance
//   dynamoose.aws.ddb.set(ddb);
//   const logger = new Logger();
//   app.setGlobalPrefix('/v1/api');

//   app.enableCors({ origin: '*' });

//   configureSwagger(app);
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       transform: true,
//       forbidNonWhitelisted: true,
//       transformOptions: {
//         enableImplicitConversion: true,
//       },
//       skipMissingProperties: true,
//     }),
//   );
//   app.listen(configService.get('port'), () => {
//     logger.log(`🚀 Trade service running on port ${configService.get('port')}`);
//   });
// }
// bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { ConfigService } from '@nestjs/config';
// import { Logger, ValidationPipe } from '@nestjs/common';
// import * as dynamoose from 'dynamoose';

// async function bootstrap() {
//   // const app = await NestFactory.create(AppModule);
//   const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
//     const configService = app.get<ConfigService>(ConfigService);
//     console.log(configService.get('aws_access_key'));
//     console.log(configService.get('aws_secret_key'));
//     console.log(configService.get('aws_region'));

//   app.enableCors({origin: '*' });
//   const logger = new Logger();
  
//   // Configure Dynamoose with AWS credentials
//   const ddb = new dynamoose.aws.ddb.DynamoDB({
//         credentials: {
//           accessKeyId: configService.get('aws_access_key'),
//           secretAccessKey: configService.get('aws_secret_key'),
//         },
//         region: configService.get('aws_region'),
//       });

//   // Initialize Dynamoose
//   dynamoose.aws.ddb.set(ddb)

//   await app.init();
//   // app.listen(configService.get('port'), () => {
//   //   logger.log(`🚀 Trade service running on port ${configService.get('port')}`);
//   // });
// }

// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as awsServerlessExpress from 'aws-serverless-express';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dynamoose from 'dynamoose';

let cachedServer: express.Application;

async function bootstrapServer(): Promise<express.Application> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  
  // Configure Dynamoose with AWS credentials
  const ddb = new dynamoose.aws.ddb.DynamoDB({
    credentials: {
      accessKeyId: configService.get('aws_access_key'),
      secretAccessKey: configService.get('aws_secret_key'),
    },
    region: configService.get('aws_region'),
  });

  // Initialize Dynamoose
  dynamoose.aws.ddb.set(ddb);
  
  // Other configurations, middleware, etc.

  await app.init();
  return app.getHttpAdapter().getInstance();

}

export async function handler(event: any, context: any) {
  if (!cachedServer) {
    const app = await bootstrapServer();
    cachedServer = awsServerlessExpress.createServer(app);
  }
  return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE');
}

// Local Development
async function startLocalServer() {
  const app = await bootstrapServer();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Local server started on port ${port}`);
}

if (process.env.NODE_ENV === 'local') {
  startLocalServer();
}


