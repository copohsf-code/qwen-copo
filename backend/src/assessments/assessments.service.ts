import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExcelService } from './excel.service';
import { AttainmentService } from './attainment.service';

@Injectable()
export class AssessmentsService {
  constructor(
    private prisma: PrismaService,
    private excelService: ExcelService,
    private attainmentService: AttainmentService,
  ) {}

  async uploadAssessment(
    subjectId: string,
    assessmentType: 'INTERNAL' | 'EXTERNAL',
    fileBuffer: Buffer,
    fileName: string,
    uploadedBy: string,
  ): Promise<any> {
    const data = await this.excelService.parseExcelFile(fileBuffer);
    this.excelService.validateAssessmentData(data, assessmentType);

    const existingAssessment = await this.prisma.assessment.findFirst({
      where: { subjectId, assessmentType },
    });

    if (existingAssessment) {
      await this.prisma.studentMark.deleteMany({
        where: { assessmentId: existingAssessment.id },
      });
      await this.prisma.assessment.delete({
        where: { id: existingAssessment.id },
      });
    }

    const assessment = await this.prisma.assessment.create({
      data: {
        subjectId,
        assessmentType,
        fileName,
        uploadedBy,
      },
    });

    const studentMarks = data.map((row: any) => ({
      rollNumber: String(row['Roll Number']),
      studentName: row['Student Name'],
      marksObtained: parseFloat(row['Marks Obtained']),
      totalMarks: parseFloat(row['Total Marks']),
      assessmentId: assessment.id,
    }));

    await this.prisma.studentMark.createMany({
      data: studentMarks,
    });

    return {
      message: `${assessmentType} assessment uploaded successfully`,
      assessmentId: assessment.id,
      studentCount: studentMarks.length,
    };
  }

  async getAssessmentsBySubject(subjectId: string) {
    return this.prisma.assessment.findMany({
      where: { subjectId },
      include: {
        studentMarks: true,
      },
    });
  }

  async calculateAttainment(subjectId: string) {
    return this.attainmentService.calculateDirectAttainment(subjectId);
  }

  async getAttainmentReport(subjectId: string) {
    const attainment = await this.attainmentService.getAttainmentBySubjectId(subjectId);
    if (!attainment) {
      throw new NotFoundException('Attainment report not found for this subject');
    }
    return attainment;
  }
}
