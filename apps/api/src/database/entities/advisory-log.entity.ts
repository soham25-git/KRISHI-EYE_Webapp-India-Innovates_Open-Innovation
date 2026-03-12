import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('advisory_logs')
export class AdvisoryLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;
}
