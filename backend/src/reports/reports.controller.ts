import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  async findAll() {
    return this.reportsService.findAll();
  }

  @Get('subject/:subjectId')
  async findBySubjectId(@Param('subjectId') subjectId: string) {
    return this.reportsService.findBySubjectId(subjectId);
  }

  @Post()
  async create(@Body() createReportDto: any) {
    return this.reportsService.create(createReportDto);
  }

  @Post('generate/:subjectId')
  async generateReport(
    @Param('subjectId') subjectId: string,
    @Body() body: { reportUrl?: string },
  ) {
    return this.reportsService.generateReport(subjectId, body.reportUrl);
  }
}
