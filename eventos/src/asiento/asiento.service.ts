import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Asiento, EstadoAsiento } from './entities/asiento.entity';
import { CreateAsientoDto } from './dto/create-asiento.dto';
import { UpdateAsientoDto } from './dto/update-asiento.dto';
import { Fila } from '../fila/entities/fila.entity';

@Injectable()
export class AsientoService {
  constructor(
    @InjectRepository(Asiento)
    private asientoRepository: Repository<Asiento>,
    @InjectRepository(Fila)
    private filaRepository: Repository<Fila>,
    private dataSource: DataSource,
  ) {}

  async create(createAsientoDto: CreateAsientoDto): Promise<Asiento> {
    const { filaId, ...rest } = createAsientoDto;
    const fila = await this.filaRepository.findOne({ where: { id: filaId } });
    if (!fila) throw new NotFoundException(`Fila ${filaId} no encontrada`);
    const asiento = this.asientoRepository.create({ ...rest, fila });
    return this.asientoRepository.save(asiento);
  }

  async findAll(): Promise<Asiento[]> {
    return this.asientoRepository.find({
      relations: { fila: { seccion: { escenario: true } } },
      order: { numero: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Asiento> {
    const asiento = await this.asientoRepository.findOne({
      where: { id },
      relations: { fila: { seccion: { escenario: true } } },
    });
    if (!asiento) throw new NotFoundException(`Asiento ${id} no encontrado`);
    return asiento;
  }

  async update(
    id: string,
    updateAsientoDto: UpdateAsientoDto,
  ): Promise<Asiento> {
    const asiento = await this.findOne(id);
    const { filaId, ...rest } = updateAsientoDto;
    if (filaId) {
      const fila = await this.filaRepository.findOne({ where: { id: filaId } });
      if (!fila) throw new NotFoundException(`Fila ${filaId} no encontrada`);
      asiento.fila = fila;
    }
    Object.assign(asiento, rest);
    return this.asientoRepository.save(asiento);
  }

  async remove(id: string): Promise<void> {
    const asiento = await this.findOne(id);
    await this.asientoRepository.remove(asiento);
  }

  async reservarAsientos(asientoIds: string[]): Promise<void> {
  if (!asientoIds || asientoIds.length === 0) {
    throw new BadRequestException('Debe proporcionar al menos un asiento');
  }

  await this.dataSource.transaction(async (manager) => {
    const asientos = await manager
      .createQueryBuilder(Asiento, 'a')
      .where('a.id IN (:...ids)', { ids: asientoIds })
      .setLock('pessimistic_write')
      .getMany();

    if (asientos.length !== asientoIds.length) {
      const encontrados = asientos.map((a) => a.id);
      const faltantes = asientoIds.filter((id) => !encontrados.includes(id));
      throw new NotFoundException(`Asientos no encontrados: ${faltantes.join(', ')}`);
    }

    const noDisponibles = asientos.filter(
      (a) => a.estado !== EstadoAsiento.DISPONIBLE,
    );
    if (noDisponibles.length > 0) {
      const numeros = noDisponibles.map((a) => a.numero).join(', ');
      throw new ConflictException(`Los asientos ${numeros} no están disponibles`);
    }

    await manager
      .createQueryBuilder()
      .update(Asiento)
      .set({ estado: EstadoAsiento.OCUPADO })
      .whereInIds(asientoIds)
      .execute();
  });
}

  // Liberar asientos (para cancelaciones)
  async liberarAsientos(asientoIds: string[]): Promise<void> {
    if (!asientoIds || asientoIds.length === 0) return;

    await this.dataSource.transaction(async (manager) => {
      const asientos = await manager
        .createQueryBuilder(Asiento, 'a')
        .where('a.id IN (:...ids)', { ids: asientoIds })
        .setLock('pessimistic_write')
        .getMany();

      const noOcupados = asientos.filter(
        (a) => a.estado !== EstadoAsiento.OCUPADO,
      );
      if (noOcupados.length > 0) {
        throw new BadRequestException('Algunos asientos no están ocupados');
      }

      await manager
        .createQueryBuilder()
        .update(Asiento)
        .set({ estado: EstadoAsiento.DISPONIBLE })
        .whereInIds(asientoIds)
        .execute();
    });
  }

  async findManyByIds(ids: string[]): Promise<Asiento[]> {
    if (!ids || ids.length === 0) return [];
    const asientos = await this.asientoRepository.find({
      where: { id: In(ids) },
      relations: { fila: { seccion: { escenario: true } } },
    });
    return asientos;
  }

  // Buscar asientos por ID del evento
  async findByEventoId(eventoId: string): Promise<Asiento[]> {
    return this.asientoRepository.find({
      where: {
        fila: {
          seccion: {
            escenario: {
              evento: { id: eventoId },
            },
          },
        },
      },
      relations: {
        fila: {
          seccion: {
            escenario: true,
          },
        },
      },
      order: {
        fila: { nombre: 'ASC' },
        numero: 'ASC',
      },
    });
  }
}
