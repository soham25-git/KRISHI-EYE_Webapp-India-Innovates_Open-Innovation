import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma.service';
import { OWNERSHIP_KEY, OwnershipMetadata } from '../decorators/ownership.decorator';

@Injectable()
export class OwnershipGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
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

        // Handle different relations using Prisma
        if (metadata.relation === 'farm_member' || metadata.relation === 'farm_owner') {
            const member = await this.prisma.farmMember.findFirst({
                where: { farmId: resourceId, userId: userId }
            });

            if (!member) {
                throw new ForbiddenException('Not a member of this farm');
            }

            if (metadata.relation === 'farm_owner' && member.role !== 'farm_owner') {
                throw new ForbiddenException('Farm owner role required');
            }
        } else if (metadata.relation === 'field_owner' || metadata.relation === 'field_member') {
            const field = await this.prisma.field.findUnique({
                where: { id: resourceId }
            });

            if (!field) {
                throw new NotFoundException('Field not found');
            }

            const member = await this.prisma.farmMember.findFirst({
                where: { farmId: field.farmId, userId: userId }
            });

            if (!member) {
                throw new ForbiddenException('Not a member of the farm owning this field');
            }

            if (metadata.relation === 'field_owner' && member.role !== 'farm_owner') {
                throw new ForbiddenException('Farm owner role required to manage fields');
            }
        } else if (metadata.relation === 'tractor_owner' || metadata.relation === 'tractor_member') {
            const tractor = await this.prisma.tractor.findUnique({
                where: { id: resourceId }
            });

            if (!tractor) {
                throw new NotFoundException('Tractor not found');
            }

            const member = await this.prisma.farmMember.findFirst({
                where: { farmId: tractor.farmId, userId: userId }
            });

            if (!member) {
                throw new ForbiddenException('Not a member of the farm owning this tractor');
            }

            if (metadata.relation === 'tractor_owner' && member.role !== 'farm_owner') {
                throw new ForbiddenException('Farm owner role required to manage tractors');
            }
        } else if (metadata.relation === 'job_owner' || metadata.relation === 'job_member') {
            const job = await this.prisma.operationJob.findUnique({
                where: { id: resourceId },
                include: { tractor: true }
            });

            if (!job) {
                throw new NotFoundException('Job not found');
            }

            const member = await this.prisma.farmMember.findFirst({
                where: { farmId: job.tractor.farmId, userId: userId }
            });

            if (!member) {
                throw new ForbiddenException('Not a member of the farm owning this job');
            }

            if (metadata.relation === 'job_owner' && member.role !== 'farm_owner') {
                throw new ForbiddenException('Farm owner role required to manage jobs');
            }
        } else if (metadata.relation === 'ticket_creator' || metadata.relation === 'ticket_member') {
            const ticket = await this.prisma.supportTicket.findUnique({
                where: { id: resourceId }
            });

            if (!ticket) {
                throw new NotFoundException('Support ticket not found');
            }

            // Ticket Creator check (Always allowed for creator)
            if (ticket.userId === userId) {
                return true;
            }

            // Ticket Member check (Allowed if ticket is farm-scoped and user is member)
            if (metadata.relation === 'ticket_member' && ticket.farmId) {
                const member = await this.prisma.farmMember.findFirst({
                    where: { farmId: ticket.farmId, userId: userId }
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
