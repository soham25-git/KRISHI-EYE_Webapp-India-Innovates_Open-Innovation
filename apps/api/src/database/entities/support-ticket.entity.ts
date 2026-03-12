import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Farm } from './farm.entity';
import { Field } from './field.entity';
import { Tractor } from './tractor.entity';
import { OperationJob } from './operation-job.entity';

@Entity('support_tickets')
export class SupportTicket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column({ nullable: true })
    farm_id: string;

    @Column({ nullable: true })
    field_id: string;

    @Column({ nullable: true })
    tractor_id: string;

    @Column({ nullable: true })
    job_id: string;

    @Column()
    category: string; // agronomy, technical, billing, other

    @Column({ default: 'medium' }) // low, medium, high, critical
    priority: string;

    @Column({ default: 'open' }) // open, in_progress, resolved, closed, cancelled
    status: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column('text', { nullable: true })
    resolution_summary: string;

    @Column({ type: 'simple-json', nullable: true })
    metadata: any;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ nullable: true })
    resolved_at: Date;

    @Column({ nullable: true })
    closed_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    creator: User;

    @ManyToOne(() => Farm, { nullable: true })
    @JoinColumn({ name: 'farm_id' })
    farm: Farm;

    @ManyToOne(() => Field, { nullable: true })
    @JoinColumn({ name: 'field_id' })
    field: Field;

    @ManyToOne(() => Tractor, { nullable: true })
    @JoinColumn({ name: 'tractor_id' })
    tractor: Tractor;

    @ManyToOne(() => OperationJob, { nullable: true })
    @JoinColumn({ name: 'job_id' })
    job: OperationJob;
}
