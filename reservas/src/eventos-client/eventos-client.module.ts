import { Module } from '@nestjs/common';
import { EventosClientService } from './eventos-client.service';

@Module({
  providers: [EventosClientService],
  exports: [EventosClientService],
})
export class EventosClientModule {}