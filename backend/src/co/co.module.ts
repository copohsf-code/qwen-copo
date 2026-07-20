import { Module } from '@nestjs/common';
import { COController } from './co.controller';
import { COService } from './co.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [COController],
  providers: [COService],
  exports: [COService],
})
export class COModule {}
