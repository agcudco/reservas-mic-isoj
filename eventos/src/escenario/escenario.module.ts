import { Module } from '@nestjs/common';
import { EscenarioService } from './escenario.service';
import { EscenarioController } from './escenario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Escenario } from './entities/escenario.entity';
import { Seccion } from '../seccion/entities/seccion.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([Escenario, Seccion])
  ],
  controllers: [EscenarioController],
  providers: [EscenarioService],
})
export class EscenarioModule {}
