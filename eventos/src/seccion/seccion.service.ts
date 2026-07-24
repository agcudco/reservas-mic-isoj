import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seccion } from './entities/seccion.entity';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';
import { Escenario } from '../escenario/entities/escenario.entity';

@Injectable()
export class SeccionService {
  constructor(
    @InjectRepository(Seccion)
    private seccionRepository: Repository<Seccion>,
    @InjectRepository(Escenario)
    private escenarioRepository: Repository<Escenario>,
  ) {}

  async create(createSeccionDto: CreateSeccionDto): Promise<Seccion> {
    const { escenarioId, ...data } = createSeccionDto;

    const escenario = await this.escenarioRepository.findOne({
      where: { id: escenarioId },
    });
    if (!escenario) {
      throw new NotFoundException(
        `Escenario con ID ${escenarioId} no encontrado`,
      );
    }

    const seccion = this.seccionRepository.create({
      ...data,
      escenario,
    });
    return this.seccionRepository.save(seccion);
  }

  async findAll(): Promise<Seccion[]> {
    return this.seccionRepository.find({
      relations: {
        escenario: true,
        filas: true,
      },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Seccion> {
    const seccion = await this.seccionRepository.findOne({
      where: { id },
      relations: {
        escenario: true,
        filas: {
          asientos: true,
        },
      },
    });
    if (!seccion) {
      throw new NotFoundException(`Sección con ID ${id} no encontrada`);
    }
    return seccion;
  }

  async update(
    id: string,
    updateSeccionDto: UpdateSeccionDto,
  ): Promise<Seccion> {
    const seccion = await this.findOne(id);

    const { escenarioId, ...rest } = updateSeccionDto;

    if (escenarioId) {
      const escenario = await this.escenarioRepository.findOne({
        where: { id: escenarioId },
      });
      if (!escenario) {
        throw new NotFoundException(
          `Escenario con ID ${escenarioId} no encontrado`,
        );
      }
      seccion.escenario = escenario;
    }

    Object.assign(seccion, rest);
    return this.seccionRepository.save(seccion);
  }

  async remove(id: string): Promise<void> {
    const seccion = await this.findOne(id);
    await this.seccionRepository.remove(seccion);
  }
}
