import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Farm } from './farm.entity';
import { OperationJob } from './operation-job.entity';

@Entity('tractors')
export class Tractor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    farm_id: string;

    @Column()
    label: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    color_hex: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Farm)
    @JoinColumn({ name: 'farm_id' })
    farm: Farm;

    @OneToMany(() => OperationJob, (job) => job.tractor)
    jobs: OperationJob[];
}
