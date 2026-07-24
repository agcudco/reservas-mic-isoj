import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilaService } from './fila.service';
import { FilaController } from './fila.controller';
import { Fila } from './entities/fila.entity';
import { Seccion } from '../seccion/entities/seccion.entity';
import { Asiento } from '../asiento/entities/asiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fila, Seccion, Asiento])],
  controllers: [FilaController],
  providers: [FilaService],
  exports: [FilaService],
})
export class FilaModule {}