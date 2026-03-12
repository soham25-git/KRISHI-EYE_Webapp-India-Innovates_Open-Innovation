import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SupportTicket } from '../database/entities/support-ticket.entity';
import { SupportOrganization, SupportContact, KnowledgeSource } from '../database/entities/other.entity';
import { FarmMember } from '../database/entities/farm-member.entity';
import { Field } from '../database/entities/field.entity';
import { Tractor } from '../database/entities/tractor.entity';
import { OperationJob } from '../database/entities/operation-job.entity';
import { CreateTicketDto, UpdateTicketDto, ContactQueryDto } from './dto/support.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private ticketRepository: Repository<SupportTicket>,
    @InjectRepository(SupportOrganization)
    private orgRepository: Repository<SupportOrganization>,
    @InjectRepository(SupportContact)
    private contactRepository: Repository<SupportContact>,
    @InjectRepository(KnowledgeSource)
    private knowledgeRepository: Repository<KnowledgeSource>,
    @InjectRepository(FarmMember)
    private memberRepository: Repository<FarmMember>,
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
    @InjectRepository(Tractor)
    private tractorRepository: Repository<Tractor>,
    @InjectRepository(OperationJob)
    private jobRepository: Repository<OperationJob>,
  ) { }

  async getOrganizations() {
    return this.orgRepository.find({ order: { name: 'ASC' } });
  }

  async getContacts(query: ContactQueryDto) {
    const where: any = {};
    if (query.state) where.state = query.state;
    if (query.district) where.district = query.district;
    if (query.category) where.category = query.category;
    if (query.orgId) where.org_id = query.orgId;

    return this.contactRepository.find({
      where,
      relations: ['organization'],
      order: { name: 'ASC' }
    });
  }

  async createTicket(dto: CreateTicketDto, userId: string) {
    // 1. Cross-resource validation if farm_id is provided
    if (dto.farmId) {
      // Check membership
      const member = await this.memberRepository.findOne({
        where: { farm_id: dto.farmId, user_id: userId }
      });
      if (!member) throw new ForbiddenException('Not a member of the specified farm');

      // Validate linked resources
      if (dto.fieldId) {
        const field = await this.fieldRepository.findOne({ where: { id: dto.fieldId } });
        if (!field || field.farm_id !== dto.farmId) throw new BadRequestException('Field does not belong to the farm');
      }
      if (dto.tractorId) {
        const tractor = await this.tractorRepository.findOne({ where: { id: dto.tractorId } });
        if (!tractor || tractor.farm_id !== dto.farmId) throw new BadRequestException('Tractor does not belong to the farm');
      }
      if (dto.jobId) {
        const job = await this.jobRepository.findOne({ where: { id: dto.jobId }, relations: ['tractor'] });
        if (!job || job.tractor.farm_id !== dto.farmId) throw new BadRequestException('Job does not belong to the farm');
      }
    }

    const ticket = this.ticketRepository.create({
      user_id: userId,
      farm_id: dto.farmId,
      field_id: dto.fieldId,
      tractor_id: dto.tractorId,
      job_id: dto.jobId,
      category: dto.category,
      priority: dto.priority || 'medium',
      title: dto.title,
      description: dto.description,
      metadata: dto.metadata,
      status: 'open'
    });

    return this.ticketRepository.save(ticket);
  }

  async findAllTickets(userId: string) {
    // User sees their own tickets OR tickets for farms they are members of
    const memberships = await this.memberRepository.find({ where: { user_id: userId } });
    const farmIds = memberships.map(m => m.farm_id);

    return this.ticketRepository.find({
      where: [
        { user_id: userId },
        { farm_id: In(farmIds) }
      ],
      order: { created_at: 'DESC' }
    });
  }

  async findOneTicket(id: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['creator', 'farm', 'field', 'tractor', 'job']
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async updateTicket(id: string, dto: UpdateTicketDto) {
    const ticket = await this.findOneTicket(id);

    // Lifecycle transitions
    if (dto.status) {
      if ((ticket.status === 'closed' || ticket.status === 'cancelled') && dto.status !== ticket.status) {
        throw new BadRequestException(`Cannot update status of a ${ticket.status} ticket`);
      }

      if (dto.status === 'resolved') {
        ticket.resolved_at = new Date();
      } else if (dto.status === 'closed') {
        ticket.closed_at = new Date();
      }
      ticket.status = dto.status;
    }

    if (dto.priority) ticket.priority = dto.priority;
    if (dto.resolutionSummary) ticket.resolution_summary = dto.resolutionSummary;

    return this.ticketRepository.save(ticket);
  }

  async escalateTicket(id: string) {
    const ticket = await this.findOneTicket(id);
    if (ticket.status !== 'open' && ticket.status !== 'in_progress') {
      throw new BadRequestException('Can only escalate active tickets');
    }

    // In KRISHI-EYE, escalation implies moving from AI/Self-service to a priority human queue
    ticket.priority = 'high';
    ticket.metadata = { ...(ticket.metadata || {}), escalated_from_ai: true };
    return this.ticketRepository.save(ticket);
  }

  async getKnowledge(query?: string, category?: string) {
    try {
      const qb = this.knowledgeRepository.createQueryBuilder('ks');
      if (category) {
        qb.andWhere('ks.category = :category', { category });
      }
      if (query) {
        qb.andWhere('(ks.title LIKE :q OR ks.content LIKE :q)', { q: `%${query}%` });
      }
      const results = await qb.orderBy('ks.created_at', 'DESC').getMany();
      
      if (results.length === 0 && (process.env.APP_ENV === 'demo' || !query)) {
        // Fallback grounded knowledge for Phase 1 Demo
        return [
          {
            id: 'demo-ks-1',
            title: 'Wheat Rust Management Protocol (ICAR)',
            category: 'pest_control',
            content: 'Yellow rust (Puccinia striiformis) appears as yellow stripes on leaves. Recommended treatment includes Propiconazole 25 EC @ 0.1% or Tebuconazole 250 EC @ 0.1%. Ensure tractor speed is maintained at 4-5 km/h for precision boom spraying.',
            source_type: 'article',
            created_at: new Date()
          },
          {
            id: 'demo-ks-2',
            title: 'Precision Spraying Safety Guidelines',
            category: 'safety',
            content: 'Always wear PPE. Calibrate boom nozzles weekly. Optimal wind speed for spraying is 3-7 km/h. Avoid spraying during high heat (11 AM - 3 PM) to prevent chemical evaporation and crop stress.',
            source_type: 'guide',
            created_at: new Date()
          }
        ] as any[];
      }
      return results;
    } catch (error) {
      console.warn('Database retrieval failed, using demo fallback', error);
      return [
        {
          id: 'error-ks-1',
          title: 'Agri Advisory Fallback',
          category: 'general',
          content: 'For precision spraying advice, please consult the Krishi Vigyan Kendra (KVK) or Kisan Call Centre (1800-180-1551). Our edge sensors recommend checking local wind speed before operation.',
          source_type: 'article',
          created_at: new Date()
        }
      ] as any[];
    }
  }
}
