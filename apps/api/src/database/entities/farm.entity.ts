import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { FarmMember } from './farm-member.entity';
import { Field } from './field.entity';

@Entity('farms')
export class Farm {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    owner_user_id: string;

    @Column()
    name: string;

    @Column()
    district: string;

    @Column()
    state: string;

    // Use { type: 'text', nullable: true } for SQLite compatibility if needed, 
    // but for PostGIS we want 'geometry'. 
    // We'll use a string for now which can represent WKT or GeoJSON for simplicity across both.
    @Column({ type: 'text', nullable: true })
    centroid_wkt: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => FarmMember, (member) => member.farm)
    members: FarmMember[];

    @OneToMany(() => Field, (field) => field.farm)
    fields: Field[];
}
