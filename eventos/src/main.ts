import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no declaradas
      forbidNonWhitelisted: false, // 🔥 NO lanzar error por propiedades extra
      transform: true,
    }),
  );
  app.enableCors();

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Microservicio de Eventos')
    .setDescription(
      'API para gestión de eventos, escenarios, secciones, filas y asientos',
    )
    .setVersion('1.0')
    .addBearerAuth() // Para autenticación JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Aplicación ejecutándose en http://localhost:${port}`);
  logger.log(`📚 Swagger disponible en http://localhost:${port}/api-docs`);
}
bootstrap();
