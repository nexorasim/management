import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export enum ProfileStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  MIGRATING = 'migrating',
}

export enum CarrierType {
  MPT = 'mpt-mm',
  ATOM = 'atom-mm',
  OOREDOO = 'ooredoo-mm',
  MYTEL = 'mytel-mm',
}

@ObjectType()
@Entity('esim_profiles')
export class Profile {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  iccid: string;

  @Field()
  @Column()
  eid: string;

  @Field()
  @Column({ type: 'enum', enum: ProfileStatus, default: ProfileStatus.INACTIVE })
  status: ProfileStatus;

  @Field()
  @Column({ type: 'enum', enum: CarrierType })
  carrier: CarrierType;

  @Field()
  @Column()
  msisdn: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imsi?: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastActivatedAt?: Date;
}