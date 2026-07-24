import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Escenario } from '../../escenario/entities/escenario.entity';

@Entity()
export class Evento {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255, nullable: false })
  nombre!: string;

  @Column({ length: 255, nullable: false })
  descripcion!: string;

  @Column({ type: 'date', nullable: false })
  fecha!: string;

  @Column({ type: 'time', nullable: false })
  hora!: string;

  @OneToOne(() => Escenario, (escenario: Escenario) => escenario.evento)
  @JoinColumn()
  escenario!: Escenario;
}
