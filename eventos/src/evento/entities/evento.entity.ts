import { Escenario } from 'src/escenario/entities/escenario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToOne(() => Escenario, (escenario) => escenario.evento)
  @JoinColumn()
  escenario!: Escenario;
}
