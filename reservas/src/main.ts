import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,           // Elimina propiedades no declaradas
      forbidNonWhitelisted: false, // NO lanza error si hay propiedades extra
      transform: true,           // Transforma automáticamente a DTO
    }),
  );
  app.enableCors();

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Microservicio de Reservas')
    .setDescription('API para gestión de reservas')
    .setVersion('1.0')
    .addBearerAuth() // Para autenticación JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Aplicación ejecutándose en http://localhost:${port}`);
  logger.log(`📚 Swagger disponible en http://localhost:${port}/api-docs`);
}
bootstrap();
