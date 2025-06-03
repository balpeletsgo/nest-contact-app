import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as client from 'prom-client';
import { Public } from 'src/auth/auth.decorator';

@Controller()
export class MetricsController {
  @Public()
  @Get('metrics')
  async getMetrics(@Res() res: Response): Promise<void> {
    try {
      res.set('Content-Type', client.register.contentType);
      const metrics = await client.register.metrics();
      res.end(metrics);
    } catch (ex) {
      res.status(500).end(ex);
    }
  }
}
