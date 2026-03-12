import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Farm } from './farm.entity';

@Entity('analytics_snapshots')
export class AnalyticsSnapshot {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    farm_id: string;

    @Column()
    period_label: string; // e.g. '2023-Q4', '2023-W52'

    @Column({ nullable: true })
    period_start: Date;

    @Column({ nullable: true })
    period_end: Date;

    @Column({ type: 'simple-json' })
    metrics: any;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Farm)
    @JoinColumn({ name: 'farm_id' })
    farm: Farm;
}
