import { Pedido } from 'src/pedidos/entities/pedido.entity';
import { Profile } from '../../profile/entities/profile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

export enum ComplaintStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export enum ComplaintType {
  PRODUCT_ISSUE = 'product_issue',
  SERVICE_ISSUE = 'service_issue',
  DELIVERY_ISSUE = 'delivery_issue',
  OTHER = 'other',
}

export enum ComplaintResolution {
  REFUND = 'refund',
  REPLACEMENT = 'replacement',
  DISCOUNT = 'discount',
  NO_ACTION = 'no_action',
}

export enum ComplaintPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.complaint, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  pedido?: Pedido;

  @ManyToOne(() => Profile, (profile) => profile.complaints, {
    nullable: false,
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({
    type: 'enum',
    enum: ComplaintStatus,
    default: ComplaintStatus.PENDING,
  })
  status: ComplaintStatus;

  @Column({
    type: 'enum',
    enum: ComplaintType,
    default: ComplaintType.OTHER,
  })
  type: ComplaintType;

  @Column({
    type: 'enum',
    enum: ComplaintResolution,
    nullable: true,
  })
  resolution: ComplaintResolution;

  @Column({
    type: 'enum',
    enum: ComplaintPriority,
    default: ComplaintPriority.MEDIUM,
  })
  priority: ComplaintPriority;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
