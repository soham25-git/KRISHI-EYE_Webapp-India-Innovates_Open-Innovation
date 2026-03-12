import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Farm } from './farm.entity';
import { User } from './user.entity';

@Entity('farm_members')
export class FarmMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    farm_id: string;

    @Column()
    user_id: string;

    @Column({ default: 'farm_viewer' }) // farm_owner, farm_member, farm_viewer
    role: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Farm, (farm) => farm.members)
    @JoinColumn({ name: 'farm_id' })
    farm: Farm;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
