import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Farm } from './farm.entity';

@Entity('fields')
export class Field {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    farm_id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    crop: string;

    @Column({ nullable: true })
    season: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    area_acres: number;

    @Column({ type: 'text', nullable: true })
    boundary_wkt: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Farm, (farm) => farm.fields)
    @JoinColumn({ name: 'farm_id' })
    farm: Farm;
}
