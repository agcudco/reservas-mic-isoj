import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface SeatUpdateEvent {
  eventoId: string;
  asientoId: string;
  estado: string;
  numero: string;
}

@Injectable()
export class SseService {
  private subjects = new Map<string, Subject<SeatUpdateEvent>>();

  getSubject(eventoId: string): Subject<SeatUpdateEvent> {
    if (!this.subjects.has(eventoId)) {
      this.subjects.set(eventoId, new Subject<SeatUpdateEvent>());
    }
    return this.subjects.get(eventoId)!;
  }

  emitUpdate(eventoId: string, update: SeatUpdateEvent) {
    const subject = this.getSubject(eventoId);
    subject.next(update);
  }
}