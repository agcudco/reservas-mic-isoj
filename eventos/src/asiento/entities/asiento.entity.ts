import { Fila } from 'src/fila/entities/fila.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum EstadoAsiento {
  DISPONIBLE = 'disponible',
  RESERVADO = 'reservado',
  OCUPADO = 'ocupado',
  MANTENIMIENTO = 'mantenimiento',
}

export enum TipoAsiento {
  NORMAL = 'normal',
  PREFERENCIAL = 'preferencial',
}

@Entity()
export class Asiento {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 12 })
  nombre!: string; //A001-F10-GENE -> A002-F11-TRIB

  @Column({ type: 'enum', enum: TipoAsiento, default: TipoAsiento.NORMAL })
  tipo!: TipoAsiento;

  @Column({
    type: 'enum',
    enum: EstadoAsiento,
    default: EstadoAsiento.DISPONIBLE,
  })
  estado!: EstadoAsiento;

  @ManyToOne(() => Fila, (fila) => fila.asientos, { onDelete: 'CASCADE' })
  fila!: Fila;
}
