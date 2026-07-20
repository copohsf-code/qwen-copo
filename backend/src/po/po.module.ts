import { Module } from '@nestjs/common';
import { POController } from './po.controller';
import { POService } from './po.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [POController],
  providers: [POService],
  exports: [POService],
})
export class POModule {}
