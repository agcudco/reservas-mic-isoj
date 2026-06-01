import { Evento } from 'src/evento/entities/evento.entity';
import { Seccion } from 'src/seccion/entities/seccion.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToOne(() => Evento, (evento) => evento.escenario)
  evento!: Evento;

  @OneToMany(() => Seccion, (seccion) => seccion.escenario)
  secciones!: Seccion[];
}
