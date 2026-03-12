import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column()
    refresh_token_hash: string;

    @Column({ nullable: true })
    device_label: string;

    @Column()
    ip_address: string;

    @Column()
    user_agent: string;

    @Column()
    expires_at: Date;

    @Column({ nullable: true })
    revoked_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
