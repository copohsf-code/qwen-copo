import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AssessmentsService } from './assessments.service';

@Controller('assessment')
@UseGuards(AuthGuard('jwt'))
export class AssessmentsController {
  constructor(private assessmentsService: AssessmentsService) {}

  @Post('internal/:subjectId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadInternal(
    @Param('subjectId') subjectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Request() req: any,
  ) {
    return this.assessmentsService.uploadAssessment(
      subjectId,
      'INTERNAL',
      file.buffer,
      file.originalname,
      req.user.email,
    );
  }

  @Post('external/:subjectId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExternal(
    @Param('subjectId') subjectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Request() req: any,
  ) {
    return this.assessmentsService.uploadAssessment(
      subjectId,
      'EXTERNAL',
      file.buffer,
      file.originalname,
      req.user.email,
    );
  }

  @Get('subject/:subjectId')
  async getAssessmentsBySubject(@Param('subjectId') subjectId: string) {
    return this.assessmentsService.getAssessmentsBySubject(subjectId);
  }

  @Post('calculate/:subjectId')
  async calculateAttainment(@Param('subjectId') subjectId: string) {
    return this.assessmentsService.calculateAttainment(subjectId);
  }

  @Get('report/:subjectId')
  async getAttainmentReport(@Param('subjectId') subjectId: string) {
    return this.assessmentsService.getAttainmentReport(subjectId);
  }
}
