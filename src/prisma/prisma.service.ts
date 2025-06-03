import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, Prisma } from 'generated/prisma';
import * as client from 'prom-client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  private readonly prismaQueryCounter = new client.Counter({
    name: 'prisma_query_total',
    help: 'Total number of Prisma queries executed',
  });

  private readonly prismaErrorCounter = new client.Counter({
    name: 'prisma_query_errors_total',
    help: 'Total number of Prisma query errors',
  });

  private readonly prismaQueryDurationHistogram = new client.Histogram({
    name: 'prisma_query_duration_seconds',
    help: 'Histogram of Prisma query durations in seconds',
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  });

  constructor() {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'warn', emit: 'event' },
        { level: 'error', emit: 'event' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.$on('query', (e) => {
      this.logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
      this.prismaQueryCounter.inc();
      this.prismaQueryDurationHistogram.observe(e.duration / 1000);
    });

    this.$on('info', (e) => {
      this.logger.log(`Info: ${e.message}`);
      this.prismaQueryCounter.inc();
    });

    this.$on('warn', (e) => {
      this.logger.warn(`Warning: ${e.message}`);
    });

    this.$on('error', (e) => {
      this.logger.error(`Error: ${e.message}`);
      this.prismaErrorCounter.inc();
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
