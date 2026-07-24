import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Seccion } from '../../seccion/entities/seccion.entity';
import { Asiento } from '../../asiento/entities/asiento.entity';

@Entity()
export class Fila {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255, nullable: false })
  nombre!: string;

  @Column({ type: 'int', default: 0 })
  capacidad!: number;

  @ManyToOne(() => Seccion, (seccion: Seccion) => seccion.filas, {
    onDelete: 'CASCADE',
  })
  seccion!: Seccion;

  @OneToMany(() => Asiento, (asiento: Asiento) => asiento.fila)
  asientos!: Asiento[];
}
