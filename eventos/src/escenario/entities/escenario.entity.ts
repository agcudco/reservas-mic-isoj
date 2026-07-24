import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Evento } from '../../evento/entities/evento.entity';
import { Seccion } from '../../seccion/entities/seccion.entity';

@Entity()
export class Escenario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255, nullable: false })
  nombre!: string;

  @Column({ length: 255 })
  descripcion!: string;

  @Column({ length: 255, nullable: false })
  ubicacion!: string;

  @Column({ type: 'int', default: 0 })
  capacidad!: number;

  @OneToOne(() => Evento, (evento: Evento) => evento.escenario)
  evento!: Evento;

  @OneToMany(() => Seccion, (seccion) => seccion.escenario)
  secciones!: Seccion[];
}
