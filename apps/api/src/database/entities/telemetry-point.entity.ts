import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Tractor } from './tractor.entity';
import { OperationJob } from './operation-job.entity';

@Entity('telemetry_points')
export class TelemetryPoint {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tractor_id: string;

    @Column()
    job_id: string;

    @Column()
    @Index()
    recorded_at: Date;

    @Column({ nullable: true })
    location_wkt: string;

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    speed_kmph: number;

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    heading_deg: number;

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    infection_intensity: number;

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    heat_weight: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    progress_percent: number;

    @Column({ type: 'simple-json', nullable: true })
    extra: any;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Tractor)
    @JoinColumn({ name: 'tractor_id' })
    tractor: Tractor;

    @ManyToOne(() => OperationJob)
    @JoinColumn({ name: 'job_id' })
    job: OperationJob;
}
