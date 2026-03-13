import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DemoService {
  private readonly logger = new Logger(DemoService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async resetData(): Promise<any> {
    this.logger.log(`Hard-resetting demo data (Mock impl for tests)`);
    // Example: await this.prisma.user.deleteMany();
    return { status: 'mocked' };
  }

  async seedJob(): Promise<any> {
    this.logger.log(`Seeding demo data (Mock impl for tests)`);
    return { status: 'mocked' };
  }
}
