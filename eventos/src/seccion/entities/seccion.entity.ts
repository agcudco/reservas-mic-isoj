import { Escenario } from 'src/escenario/entities/escenario.entity';
import { Fila } from 'src/fila/entities/fila.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TipoSeccion {
  VIP = 'VIP',
  GENERAL = 'general',
  PALCO = 'palco',
  TRUBUNA = 'tribuna',
}

@Entity()
export class Seccion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255, nullable: false })
  nombre!: string;

  @Column({ length: 255 })
  descripcion!: string;

  @Column({ type: 'enum', enum: TipoSeccion, default: TipoSeccion.GENERAL })
  tipoSeccion!: TipoSeccion;

  @Column({ type: 'int', default: 0 })
  capacidad!: number;

  @ManyToOne(() => Escenario, (escenario) => escenario.secciones)
  escenario!: Escenario;

  @OneToMany(() => Fila, (fila) => fila.seccion)
  filas!: Fila[];
}
