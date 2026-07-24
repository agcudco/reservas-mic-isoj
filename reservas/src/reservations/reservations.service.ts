import {
  Injectable,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { EventosClientService } from '../eventos-client/eventos-client.service';
import { ReservationStatus } from './enums/reservatios-ststus.enum';

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private eventosClient: EventosClientService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    usuarioId: string,
    userToken?: string,
  ) {
    const { eventoId, asientoIds } = createReservationDto;

    // Validación extra por si el DTO no se mapeó correctamente
    if (!eventoId) {
      this.logger.error('❌ eventoId es undefined o null en el DTO');
      throw new BadRequestException(
        'El eventoId es obligatorio y no se recibió correctamente',
      );
    }

    this.logger.log(
      `📝 Iniciando reserva para usuario ${usuarioId}, evento ${eventoId}`,
    );

    // 1. Obtener asientos del evento
    const asientosEvento =
      await this.eventosClient.findAsientosByEvento(eventoId);
    this.logger.log(
      `📦 Asientos recibidos del evento: ${asientosEvento.length}`,
    );

    // 2. Crear Map para acceso rápido
    const asientosMap = new Map(asientosEvento.map((a) => [a.id, a]));
    this.logger.log(
      `🗺️ IDs en el Map: ${Array.from(asientosMap.keys()).join(', ')}`,
    );

    // 3. Validar existencia
    const noExisten = asientoIds.filter((id) => !asientosMap.has(id));
    if (noExisten.length > 0) {
      this.logger.error(`❌ IDs no encontrados en el Map: ${noExisten}`);
      throw new BadRequestException(
        `Los siguientes asientos no existen: ${noExisten.join(', ')}`,
      );
    }

    // 4. Validar disponibilidad
    const noDisponibles = asientoIds.filter(
      (id) => asientosMap.get(id)!.estado !== 'disponible',
    );
    if (noDisponibles.length > 0) {
      this.logger.error(`❌ Asientos no disponibles: ${noDisponibles}`);
      throw new ConflictException(
        `Los siguientes asientos no están disponibles: ${noDisponibles.join(', ')}`,
      );
    }

    // 5. Llamar al microservicio de eventos con el token del usuario
    await this.eventosClient.reservarAsientos(asientoIds, userToken);

    // 6. Crear reserva local
    const reserva = this.reservationRepository.create({
      eventoId,
      usuarioId,
      asientoIds,
      estado: ReservationStatus.ACTIVE,
    });

    const saved = await this.reservationRepository.save(reserva);
    this.logger.log(`✅ Reserva creada exitosamente: ${saved.id}`);
    return saved;
  }

  async findAllByUser(usuarioId: string): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { usuarioId },
      order: { fechaReserva: 'DESC' },
    });
  }

  async findOne(id: string, usuarioId: string): Promise<Reservation> {
    const reserva = await this.reservationRepository.findOne({
      where: { id, usuarioId },
    });
    if (!reserva) throw new BadRequestException('Reserva no encontrada');
    return reserva;
  }

  async cancel(id: string, usuarioId: string): Promise<Reservation> {
    const reserva = await this.findOne(id, usuarioId);
    if (reserva.estado === ReservationStatus.CANCELLED) {
      throw new BadRequestException('La reserva ya está cancelada');
    }
    reserva.estado = ReservationStatus.CANCELLED;
    return this.reservationRepository.save(reserva);
  }
}
