import { Module } from '@nestjs/common';
import { EscenarioService } from './escenario.service';
import { EscenarioController } from './escenario.controller';

@Module({
  controllers: [EscenarioController],
  providers: [EscenarioService],
})
export class EscenarioModule {}
