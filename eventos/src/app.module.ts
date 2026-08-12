import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoModule } from './evento/evento.module';
import { EscenarioModule } from './escenario/escenario.module';
import { SeccionModule } from './seccion/seccion.module';
import { FilaModule } from './fila/fila.module';
import { AsientoModule } from './asiento/asiento.module';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SseModule } from './sse/sse.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(), // para eventos internos
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // solo desarrollo
        logging: true,
      }),
    }),
    EventoModule,
    EscenarioModule,
    SeccionModule,
    FilaModule,
    AsientoModule,
    AuthModule,
    SseModule,
  ],
})
export class AppModule {}
