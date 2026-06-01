import { Injectable } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { Evento } from './entities/evento.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Escenario } from 'src/escenario/entities/escenario.entity';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(Evento)
    private eventoRepository: Repository<Evento>,
    @InjectRepository(Escenario)
    private escenarioRepository: Repository<Escenario>,
  ) {}

  create(createEventoDto: CreateEventoDto) {
    return 'This action adds a new evento';
  }

  findAll() {
    return `This action returns all evento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} evento`;
  }

  update(id: number, updateEventoDto: UpdateEventoDto) {
    return `This action updates a #${id} evento`;
  }

  remove(id: number) {
    return `This action removes a #${id} evento`;
  }
}
