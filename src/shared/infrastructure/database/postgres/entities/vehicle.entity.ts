import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientEntity } from './client.entity';

@Entity('vehicle')
export class VehicleEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'client_id', type: 'uuid' })
  clientId!: string;

  @ManyToOne(() => ClientEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'client_id' })
  client?: ClientEntity;

  @Column({ unique: true })
  plate!: string;

  @Column()
  model!: string;

  @Column()
  brand!: string;

  @Column('int')
  year!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
