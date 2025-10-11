import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('abm_tokens')
export class ABMToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orgId: string;

  @Column()
  orgName: string;

  @Column({ type: 'text' })
  serverToken: string;

  @Column({ type: 'text' })
  consumerKey: string;

  @Column({ type: 'text' })
  consumerSecret: string;

  @Column({ type: 'text' })
  accessToken: string;

  @Column({ type: 'text' })
  accessSecret: string;

  @Column()
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastSyncAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  capabilities: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}