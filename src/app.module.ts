import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';
import { CarrierModule } from './carrier/carrier.module';
import { IoTModule } from './iot/iot.module';
import { SSLModule } from './ssl/ssl.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
    }),
    ProfileModule,
    AuthModule,
    AuditModule,
    CarrierModule,
    IoTModule,
    SSLModule,
  ],
})
export class AppModule {}