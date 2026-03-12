import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Query } from '@nestjs/common';
import { SupportService } from './support.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CheckOwnership } from '../common/decorators/ownership.decorator';
import { ContactQueryDto, CreateTicketDto, UpdateTicketDto } from './dto/support.dto';

@ApiTags('support')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OwnershipGuard)
@Controller({ path: 'support', version: '1' })
export class SupportController {
  constructor(private readonly supportService: SupportService) { }

  @Get('organizations')
  @ApiOperation({ summary: 'List support organizations' })
  getOrganizations() {
    return this.supportService.getOrganizations();
  }

  @Get('contacts')
  @ApiOperation({ summary: 'List support contacts with filters' })
  getContacts(@Query() query: ContactQueryDto) {
    return this.supportService.getContacts(query);
  }

  @Post('tickets')
  @ApiOperation({ summary: 'Create a new support or agronomy ticket' })
  createTicket(@Body() createTicketDto: CreateTicketDto, @Req() req: any) {
    return this.supportService.createTicket(createTicketDto, req.user.sub || req.user.id);
  }

  @Get('tickets')
  @ApiOperation({ summary: 'List all tickets created by the user' })
  findAllTickets(@Req() req: any) {
    return this.supportService.findAllTickets(req.user.sub || req.user.id);
  }

  @Get('tickets/:ticketId')
  @CheckOwnership('ticketId', 'ticket_member')
  @ApiOperation({ summary: 'Get details of a specific ticket' })
  findOneTicket(@Param('ticketId') ticketId: string) {
    return this.supportService.findOneTicket(ticketId);
  }

  @Patch('tickets/:ticketId')
  @CheckOwnership('ticketId', 'ticket_creator')
  @ApiOperation({ summary: 'Update ticket (e.g. close it)' })
  updateTicket(@Param('ticketId') ticketId: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.supportService.updateTicket(ticketId, updateTicketDto);
  }

  @Post('tickets/:ticketId/escalate')
  @CheckOwnership('ticketId', 'ticket_creator')
  @ApiOperation({ summary: 'Escalate a ticket to human agronomist' })
  escalateTicket(@Param('ticketId') ticketId: string) {
    return this.supportService.escalateTicket(ticketId);
  }

  @Get('knowledge')
  @ApiOperation({ summary: 'Search and list knowledge source items' })
  getKnowledge(@Query('query') query: string, @Query('category') category: string) {
    return this.supportService.getKnowledge(query, category);
  }
}
