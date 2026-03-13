import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { Farm } from './entities/farm.entity';
import { FarmMember } from './entities/farm-member.entity';
import { Field } from './entities/field.entity';
import { Tractor } from './entities/tractor.entity';
import { OperationJob } from './entities/operation-job.entity';
import { TelemetryPoint } from './entities/telemetry-point.entity';
import { AnalyticsSnapshot } from './entities/analytics-snapshot.entity';
import { SupportTicket } from './entities/support-ticket.entity';
import { AdvisoryLog } from './entities/advisory-log.entity';
import { FarmerProfile, SupportOrganization, SupportContact, KnowledgeSource, KnowledgeChunk, AuditLog, ConsentRecord } from './entities/other.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: (process.env.NODE_ENV === 'test' || process.env.APP_ENV === 'demo') ? 'sqlite' : 'postgres',
            ...(process.env.DATABASE_URL && process.env.NODE_ENV !== 'test' && process.env.APP_ENV !== 'demo'
                ? {
                    url: process.env.DATABASE_URL,
                    ssl: { rejectUnauthorized: false },
                }
                : {
                    database: (process.env.NODE_ENV === 'test')
                        ? ':memory:'
                        : (process.env.APP_ENV === 'demo')
                            ? 'krishi_demo.sqlite'
                            : (process.env.DB_NAME || 'krishi_eye'),
                    host: (process.env.NODE_ENV === 'test' || process.env.APP_ENV === 'demo') ? undefined : (process.env.DB_HOST || 'localhost'),
                    port: (process.env.NODE_ENV === 'test' || process.env.APP_ENV === 'demo') ? undefined : parseInt(process.env.DB_PORT || '5432', 10),
                    username: (process.env.NODE_ENV === 'test' || process.env.APP_ENV === 'demo') ? undefined : (process.env.DB_USER || 'postgres'),
                    password: (process.env.NODE_ENV === 'test' || process.env.APP_ENV === 'demo') ? undefined : (process.env.DB_PASSWORD || 'postgres'),
                }),
            entities: [
                User, Session, FarmerProfile, Farm, FarmMember, Field, Tractor, OperationJob,
                TelemetryPoint, AnalyticsSnapshot, SupportOrganization, SupportContact,
                SupportTicket, KnowledgeSource, KnowledgeChunk, AuditLog, AdvisoryLog, ConsentRecord
            ],
            synchronize: false,
            logging: false,
        }),
    ],
})
export class DatabaseModule { }
