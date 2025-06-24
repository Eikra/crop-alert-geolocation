import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const configService = app.get(ConfigService);
//   const frontendUrl = configService.get<string>('FRONTEND_URL');

//   app.enableCors({
//     origin: [frontendUrl],  // Use env variable here ✅
//     credentials: true,
//   });

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//     }),
//   );

//   const port = configService.get<number>('PORT_FRONT') || 3001;
//   await app.listen(port);
//   console.log(`🚀 Server is running on port ${port}`);
// }
// bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const allowedOrigins = [
    configService.get<string>('FRONTEND_URL'),
    configService.get<string>('FRONTEND_URL_STAGING'),
  ].filter(Boolean);  // remove undefined if any

  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);  // allow all origins dynamically
    },
    credentials: true, // ⚠️ credentials:true cannot be used with '*' !!
  });


  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const port = configService.get<number>('PORT_BCKEND') || 3000;
  // await app.listen(port);
  await app.listen(port, '0.0.0.0');
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { IoAdapter } from '@nestjs/platform-socket.io';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const configService = app.get(ConfigService);
//   const allowedOrigins = [
//     configService.get<string>('FRONTEND_URL'),
//     configService.get<string>('FRONTEND_URL_STAGING'),
//   ].filter(Boolean);  // remove undefined if any

//   app.enableCors({
//     origin: (origin, callback) => {
//       callback(null, true);  // allow all origins dynamically
//     },
//     credentials: true,
//   });

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ParseIntPipe, ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//     app.enableCors({
//     origin: ['http://localhost:3001'], // <-- allow frontend origin
//     credentials: true,
//   });
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//     }),
//   );
//   await app.listen(process.env.PORT ?? 3000);

// }
// bootstrap();
