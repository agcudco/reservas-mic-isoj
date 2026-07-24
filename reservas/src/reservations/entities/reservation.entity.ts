import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ReservationStatus } from '../enums/reservatios-ststus.enum';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', name: 'evento_id' })   // ✅ Cambio a VARCHAR
  eventoId!: string;

  @Column({ type: 'varchar', name: 'usuario_id' })  // ✅ Cambio a VARCHAR
  usuarioId!: string;

  @Column({ type: 'varchar', array: true, name: 'asiento_ids' }) // ✅ Cambio a VARCHAR[]
  asientoIds!: string[];

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  estado!: ReservationStatus;

  @CreateDateColumn({ name: 'fecha_reserva' })
  fechaReserva!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}