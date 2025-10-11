import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AppleDevice } from './apple-device.entity';

@Entity('mdm_commands')
export class MDMCommand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  commandUUID: string;

  @Column()
  requestType: string;

  @Column({ type: 'jsonb' })
  command: any;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  response: any;

  @Column({ nullable: true })
  errorChain: string;

  @Column({ default: 0 })
  retryCount: number;

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column({ nullable: true })
  sentAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @ManyToOne(() => AppleDevice, device => device.commands)
  @JoinColumn({ name: 'deviceId' })
  device: AppleDevice;

  @Column()
  deviceId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}