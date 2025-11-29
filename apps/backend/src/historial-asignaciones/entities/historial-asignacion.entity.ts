import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('asignaciones_historial')
export class HistorialAsignacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_conductor', type: 'varchar', length: 255 })
  nombreConductor: string;

  @Column({ type: 'varchar', length: 18 })
  curp: string;

  @Column({ name: 'placas_unidad', type: 'varchar', length: 20 })
  placasUnidad: string;

  @Column({ name: 'oficina_salida', type: 'varchar', length: 5 })
  claveOficinaSalida: string;

  @Column({ name: 'clave_cuo_destino', type: 'varchar', length: 10, nullable: true })
  claveOficinaDestino: string | null;

  @Column({
    name: 'clave_oficina_actual',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  claveOficinaActual: string | null;

  @Column({
    name: 'fecha_asignacion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaAsignacion: Date;

  @Column({ name: 'fecha_llegada_destino', type: 'timestamp', nullable: true })
  fechaLlegadaDestino: Date | null;

  @Column({ name: 'fecha_finalizacion', type: 'timestamp', nullable: true })
  fechaFinalizacion: Date | null;
}
