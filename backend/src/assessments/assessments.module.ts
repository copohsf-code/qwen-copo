import { Module } from '@nestjs/common';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { ExcelService } from './excel.service';
import { AttainmentService } from './attainment.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AssessmentsController],
  providers: [AssessmentsService, ExcelService, AttainmentService],
  exports: [AssessmentsService, ExcelService, AttainmentService],
})
export class AssessmentsModule {}
