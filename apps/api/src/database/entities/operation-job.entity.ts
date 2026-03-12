import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tractor } from './tractor.entity';
import { Field } from './field.entity';

@Entity('operation_jobs')
export class OperationJob {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tractor_id: string;

    @Column()
    field_id: string;

    @Column({ default: 'pending' }) // pending, running, completed, cancelled
    status: string;

    @Column({ nullable: true })
    started_at: Date;

    @Column({ nullable: true })
    ended_at: Date;

    @Column({ type: 'decimal', nullable: true })
    avg_speed_kmph: number;

    @Column({ type: 'decimal', nullable: true })
    total_distance_m: number;

    @Column({ type: 'simple-json', nullable: true })
    coverage_summary: any;

    @Column({ type: 'simple-json', nullable: true })
    improvement_summary: any;

    @Column({ default: 'manual' })
    source_type: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Tractor, (tractor) => tractor.jobs)
    @JoinColumn({ name: 'tractor_id' })
    tractor: Tractor;

    @ManyToOne(() => Field)
    @JoinColumn({ name: 'field_id' })
    field: Field;
}
