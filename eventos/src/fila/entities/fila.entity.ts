import { Asiento } from 'src/asiento/entities/asiento.entity';
import { Seccion } from 'src/seccion/entities/seccion.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Fila {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255, nullable: false })
  nombre!: string;

  @Column({ type: 'int', default: 0 })
  capacidad!: number;

  @ManyToOne(() => Seccion, (seccion) => seccion.filas, { onDelete: 'CASCADE' })
  seccion!: Seccion;

  @OneToMany(() => Asiento, (asiento) => asiento.fila)
  asientos!: Asiento[];
}
