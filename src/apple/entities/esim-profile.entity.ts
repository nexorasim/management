import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AppleDevice } from './apple-device.entity';

@Entity('esim_profiles')
export class ESIMProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  iccid: string;

  @Column({ nullable: true })
  eid: string;

  @Column()
  smdpAddress: string;

  @Column()
  activationCode: string;

  @Column()
  confirmationCode: string;

  @Column()
  carrier: string;

  @Column()
  plan: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  installationDate: Date;

  @Column({ nullable: true })
  activationDate: Date;

  @Column({ nullable: true })
  suspensionDate: Date;

  @Column({ nullable: true })
  deletionDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  profileData: any;

  @Column({ type: 'jsonb', nullable: true })
  installationResponse: any;

  @Column({ default: false })
  isTransferEligible: boolean;

  @Column({ nullable: true })
  transferRequestId: string;

  @ManyToOne(() => AppleDevice, device => device.esimProfiles, { nullable: true })
  @JoinColumn({ name: 'deviceId' })
  device: AppleDevice;

  @Column({ nullable: true })
  deviceId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}