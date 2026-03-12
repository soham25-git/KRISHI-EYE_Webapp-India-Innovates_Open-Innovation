import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('farmer_profiles')
export class FarmerProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;
}

@Entity('support_organizations')
export class SupportOrganization {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ nullable: true })
    website: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

@Entity('support_contacts')
export class SupportContact {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    org_id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    role: string;

    @Column()
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    state: string;

    @Column()
    district: string;

    @Column()
    category: string; // agronomist, technical_support, government_office

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => SupportOrganization)
    @JoinColumn({ name: 'org_id' })
    organization: SupportOrganization;
}

@Entity('knowledge_sources')
export class KnowledgeSource {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    category: string;

    @Column({ default: 'article' }) // article, faq, guide
    content_type: string;

    @Column('text')
    content: string;

    @Column({ type: 'simple-array', nullable: true })
    tags: string[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

@Entity('knowledge_chunks')
export class KnowledgeChunk {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    source_id: string;

    @Column('text')
    content_chunk: string;

    @Column({ type: 'simple-json', nullable: true })
    vector_placeholder: any;

    @ManyToOne(() => KnowledgeSource)
    @JoinColumn({ name: 'source_id' })
    source: KnowledgeSource;
}

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column()
    action: string;

    @Column({ nullable: true })
    resource_type: string;

    @Column({ nullable: true })
    resource_id: string;

    @Column({ type: 'simple-json', nullable: true })
    payload: any;

    @CreateDateColumn()
    created_at: Date;
}

@Entity('consent_records')
export class ConsentRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column()
    consent_type: string;

    @Column()
    granted: boolean;

    @CreateDateColumn()
    created_at: Date;
}
