import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('unidad_sucursal')
export class UnidadSucursal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_unidad', type: 'int' })
  idUnidad: number;

  @Column({ name: 'clave_sucursal', length: 5 })
  claveSucursal: string;

  @Column({ name: 'estado_unidad' })
  estadoUnidad: 'transito' | 'disponible' | 'mantenimiento' | 'no disponible';

  @Column({ name: 'conductor_unidad' })
  conductorUnidad: string;
}
