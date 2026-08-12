import { Controller, Sse, Param, Logger } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { SseService, SeatUpdateEvent } from './sse.service';

@Controller('sse')
export class SseController {
  private readonly logger = new Logger(SseController.name);

  constructor(private readonly sseService: SseService) {}

  @Sse('evento/:eventoId')
  subscribe(@Param('eventoId') eventoId: string): Observable<any> {
    this.logger.log(`Nuevo cliente SSE para evento ${eventoId}`);
    const subject = this.sseService.getSubject(eventoId);
    return subject.asObservable().pipe(
      map((data: SeatUpdateEvent) => ({ data })),
    );
  }
}