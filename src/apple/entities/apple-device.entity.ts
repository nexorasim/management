import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MDMCommand } from './mdm-command.entity';
import { ESIMProfile } from './esim-profile.entity';

@Entity('apple_devices')
export class AppleDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  udid: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ nullable: true })
  imei: string;

  @Column({ nullable: true })
  eid: string;

  @Column()
  deviceName: string;

  @Column()
  model: string;

  @Column()
  osVersion: string;

  @Column({ default: false })
  isSupervised: boolean;

  @Column({ default: false })
  isUserApprovedMDM: boolean;

  @Column({ default: 'enrolled' })
  enrollmentStatus: string;

  @Column({ nullable: true })
  pushMagic: string;

  @Column({ nullable: true })
  pushToken: string;

  @Column({ nullable: true })
  unlockToken: string;

  @Column({ nullable: true })
  bootstrapToken: string;

  @Column({ type: 'jsonb', nullable: true })
  deviceInformation: any;

  @Column({ type: 'jsonb', nullable: true })
  securityInfo: any;

  @Column({ type: 'jsonb', nullable: true })
  restrictions: any;

  @Column({ nullable: true })
  lastSeen: Date;

  @OneToMany(() => MDMCommand, command => command.device)
  commands: MDMCommand[];

  @OneToMany(() => ESIMProfile, profile => profile.device)
  esimProfiles: ESIMProfile[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}