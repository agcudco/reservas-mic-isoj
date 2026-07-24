import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Fila } from '../../fila/entities/fila.entity';

export enum EstadoAsiento {
  DISPONIBLE = 'disponible',
  OCUPADO = 'ocupado',
  MANTENIMIENTO = 'mantenimiento',
}

export enum TipoAsiento {
  NORMAL = 'normal',
  VIP = 'vip',
  PREFERENCIAL = 'preferencial',
}

@Entity()
export class Asiento {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 10 })
  numero!: string; // ✅ Propiedad definida

  @Column({
    type: 'enum',
    enum: EstadoAsiento,
    default: EstadoAsiento.DISPONIBLE,
  })
  estado!: EstadoAsiento;

  @Column({ type: 'enum', enum: TipoAsiento, default: TipoAsiento.NORMAL })
  tipo!: TipoAsiento;

  @ManyToOne(() => Fila, (fila) => fila.asientos, { onDelete: 'CASCADE' })
  fila!: Fila;
}
