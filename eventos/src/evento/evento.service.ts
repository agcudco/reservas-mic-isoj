import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { Evento } from './entities/evento.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Escenario } from '../escenario/entities/escenario.entity';


@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(Evento)
    private eventoRepository: Repository<Evento>,
    @InjectRepository(Escenario)
    private escenarioRepository: Repository<Escenario>,
  ) {}

  async create(createEventoDto: CreateEventoDto): Promise<Evento> {
    const { escenarioId, ...eventoData } = createEventoDto;

    const escenario = await this.escenarioRepository.findOneBy({
      id: escenarioId,
    });

    if (!escenario) {
      throw new NotFoundException('Escenario not found');
    }

    const evento = this.eventoRepository.create({ ...eventoData, escenario });

    return this.eventoRepository.save(evento);
  }

  async findAll(): Promise<Evento[]> {
    return this.eventoRepository.find();
  }

  async findOne(id: string): Promise<Evento> {
    const evento = await this.eventoRepository.findOneBy({ id });

    if (!evento) {
      throw new NotFoundException('Evento not found');
    }

    return evento;
  }

  update(id: number, updateEventoDto: UpdateEventoDto) {
    return `This action updates a #${id} evento`;
  }

  remove(id: number) {
    return `This action removes a #${id} evento`;
  }
}
