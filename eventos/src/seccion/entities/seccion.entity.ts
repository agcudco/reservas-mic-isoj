import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Escenario } from '../../escenario/entities/escenario.entity';
import { Fila } from '../../fila/entities/fila.entity';

export enum TipoSeccion {
  VIP = 'VIP',
  GENERAL = 'general',
  PALCO = 'palco',
  TRIBUNAL = 'tribuna',
}

@Entity()
export class Seccion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255, nullable: false })
  nombre!: string;

  @Column({ length: 255, nullable: true })
  descripcion?: string;

  @Column({ type: 'enum', enum: TipoSeccion, default: TipoSeccion.GENERAL })
  tipoSeccion!: TipoSeccion;

  @Column({ type: 'int', default: 0 })
  capacidad!: number;

  @ManyToOne(() => Escenario, (escenario) => escenario.secciones, {
    onDelete: 'CASCADE',
  })
  escenario!: Escenario;

  @OneToMany(() => Fila, (fila) => fila.seccion)
  filas!: Fila[];
}
