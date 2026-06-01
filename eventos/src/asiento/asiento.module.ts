import { Module } from '@nestjs/common';
import { AsientoService } from './asiento.service';
import { AsientoController } from './asiento.controller';

@Module({
  controllers: [AsientoController],
  providers: [AsientoService],
})
export class AsientoModule {}
