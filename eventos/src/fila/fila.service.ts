import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fila } from './entities/fila.entity';
import { CreateFilaDto } from './dto/create-fila.dto';
import { UpdateFilaDto } from './dto/update-fila.dto';
import { Seccion } from '../seccion/entities/seccion.entity';

@Injectable()
export class FilaService {
  constructor(
    @InjectRepository(Fila)
    private filaRepository: Repository<Fila>,
    @InjectRepository(Seccion)
    private seccionRepository: Repository<Seccion>,
  ) {}

  async create(createFilaDto: CreateFilaDto): Promise<Fila> {
    const { seccionId, ...data } = createFilaDto;

    const seccion = await this.seccionRepository.findOne({
      where: { id: seccionId },
    });
    if (!seccion) {
      throw new NotFoundException(`Sección con ID ${seccionId} no encontrada`);
    }

    const fila = this.filaRepository.create({
      ...data,
      seccion,
    });
    return this.filaRepository.save(fila);
  }

  async findAll(): Promise<Fila[]> {
    return this.filaRepository.find({
      relations: {
        seccion: true,
        asientos: true,
      },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Fila> {
    const fila = await this.filaRepository.findOne({
      where: { id },
      relations: {
        seccion: true,
        asientos: true,
      },
    });
    if (!fila) {
      throw new NotFoundException(`Fila con ID ${id} no encontrada`);
    }
    return fila;
  }

  async update(id: string, updateFilaDto: UpdateFilaDto): Promise<Fila> {
    const fila = await this.findOne(id);

    const { seccionId, ...rest } = updateFilaDto;

    if (seccionId) {
      const seccion = await this.seccionRepository.findOne({
        where: { id: seccionId },
      });
      if (!seccion) {
        throw new NotFoundException(`Sección con ID ${seccionId} no encontrada`);
      }
      fila.seccion = seccion;
    }

    Object.assign(fila, rest);
    return this.filaRepository.save(fila);
  }

  async remove(id: string): Promise<void> {
    const fila = await this.findOne(id);
    await this.filaRepository.remove(fila);
  }
}