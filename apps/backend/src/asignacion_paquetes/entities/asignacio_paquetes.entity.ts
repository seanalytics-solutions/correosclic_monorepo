import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Paquete } from '../../paquete/entities/paquete.entity';

@Entity('asignacion_paquetes')
export class AsignacionPaquetes {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'fecha_asignacion' })
  fecha_asignacion: Date;

  @ManyToOne(() => Paquete, { nullable: true })
  @JoinColumn({ name: 'idPaqueteId' })
  idPaquete: Paquete;

}
