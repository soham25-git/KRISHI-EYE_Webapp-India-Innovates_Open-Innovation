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

// Parse DATABASE_URL if available, otherwise fall back to individual env vars or SQLite for demo
function getTypeOrmConfig() {
    const dbUrl = process.env.DATABASE_URL;
    const isDemo = process.env.APP_ENV === 'demo';
    const isTest = process.env.NODE_ENV === 'test';

    if (isTest) {
        return { type: 'sqlite' as const, database: ':memory:' };
    }

    if (isDemo) {
        return { type: 'sqlite' as const, database: 'krishi_demo.sqlite' };
    }

    if (dbUrl) {
        // Render provides DATABASE_URL in standard postgres:// format
        return {
            type: 'postgres' as const,
            url: dbUrl,
            ssl: { rejectUnauthorized: false },
        };
    }

    // Fallback to individual env vars for local dev
    return {
        type: 'postgres' as const,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'krishi_eye',
    };
}

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...getTypeOrmConfig(),
            entities: [
                User, Session, FarmerProfile, Farm, FarmMember, Field, Tractor, OperationJob,
                TelemetryPoint, AnalyticsSnapshot, SupportOrganization, SupportContact,
                SupportTicket, KnowledgeSource, KnowledgeChunk, AuditLog, AdvisoryLog, ConsentRecord
            ],
            synchronize: false, // Never auto-sync in production — use Prisma migrations
            logging: false,
        }),
    ],
})
export class DatabaseModule { }
