import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { OWNERSHIP_KEY, OwnershipMetadata } from '../decorators/ownership.decorator';
import { FarmMember } from '../../database/entities/farm-member.entity';
import { Field } from '../../database/entities/field.entity';
import { Tractor } from '../../database/entities/tractor.entity';
import { OperationJob } from '../../database/entities/operation-job.entity';
import { SupportTicket } from '../../database/entities/support-ticket.entity';

@Injectable()
export class OwnershipGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private dataSource: DataSource,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const metadata = this.reflector.get<OwnershipMetadata>(OWNERSHIP_KEY, context.getHandler());
        if (!metadata) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const { user, params } = request;
        const userId = user?.sub || user?.id;

        if (!userId) {
            return false;
        }

        const resourceId = params[metadata.param];
        if (!resourceId) {
            return true; // No ID to check ownership for
        }

        // Handle different relations
        if (metadata.relation === 'farm_member' || metadata.relation === 'farm_owner') {
            const memberRepo = this.dataSource.getRepository(FarmMember);
            const member = await memberRepo.findOne({
                where: { farm_id: resourceId, user_id: userId }
            });

            if (!member) {
                throw new ForbiddenException('Not a member of this farm');
            }

            if (metadata.relation === 'farm_owner' && member.role !== 'farm_owner') {
                throw new ForbiddenException('Farm owner role required');
            }
        } else if (metadata.relation === 'field_owner' || metadata.relation === 'field_member') {
            const fieldRepo = this.dataSource.getRepository(Field);
            const field = await fieldRepo.findOne({
                where: { id: resourceId }
            });

            if (!field) {
                throw new NotFoundException('Field not found');
            }

            const memberRepo = this.dataSource.getRepository(FarmMember);
            const member = await memberRepo.findOne({
                where: { farm_id: field.farm_id, user_id: userId }
            });

            if (!member) {
                throw new ForbiddenException('Not a member of the farm owning this field');
            }

            if (metadata.relation === 'field_owner' && member.role !== 'farm_owner') {
                throw new ForbiddenException('Farm owner role required to manage fields');
            }
        } else if (metadata.relation === 'tractor_owner' || metadata.relation === 'tractor_member') {
            const tractorRepo = this.dataSource.getRepository(Tractor);
            const tractor = await tractorRepo.findOne({
                where: { id: resourceId }
            });

            if (!tractor) {
                throw new NotFoundException('Tractor not found');
            }

            const memberRepo = this.dataSource.getRepository(FarmMember);
            const member = await memberRepo.findOne({
                where: { farm_id: tractor.farm_id, user_id: userId }
            });

            if (!member) {
                throw new ForbiddenException('Not a member of the farm owning this tractor');
            }

            if (metadata.relation === 'tractor_owner' && member.role !== 'farm_owner') {
                throw new ForbiddenException('Farm owner role required to manage tractors');
            }
        } else if (metadata.relation === 'job_owner' || metadata.relation === 'job_member') {
            const jobRepo = this.dataSource.getRepository(OperationJob);
            const job = await jobRepo.findOne({
                where: { id: resourceId },
                relations: ['tractor']
            });

            if (!job) {
                throw new NotFoundException('Job not found');
            }

            const memberRepo = this.dataSource.getRepository(FarmMember);
            const member = await memberRepo.findOne({
                where: { farm_id: job.tractor.farm_id, user_id: userId }
            });

            if (!member) {
                throw new ForbiddenException('Not a member of the farm owning this job');
            }

            if (metadata.relation === 'job_owner' && member.role !== 'farm_owner') {
                throw new ForbiddenException('Farm owner role required to manage jobs');
            }
        } else if (metadata.relation === 'ticket_creator' || metadata.relation === 'ticket_member') {
            const ticketRepo = this.dataSource.getRepository(require('../../database/entities/support-ticket.entity').SupportTicket);
            const ticket = await ticketRepo.findOne({
                where: { id: resourceId }
            });

            if (!ticket) {
                throw new NotFoundException('Support ticket not found');
            }

            // Ticket Creator check (Always allowed for creator)
            if (ticket.user_id === userId) {
                return true;
            }

            // Ticket Member check (Allowed if ticket is farm-scoped and user is member)
            if (metadata.relation === 'ticket_member' && ticket.farm_id) {
                const memberRepo = this.dataSource.getRepository(FarmMember);
                const member = await memberRepo.findOne({
                    where: { farm_id: ticket.farm_id, user_id: userId }
                });

                if (member) {
                    return true;
                }
            }

            throw new ForbiddenException('Unauthorized access to this support ticket');
        }

        return true;
    }
}
