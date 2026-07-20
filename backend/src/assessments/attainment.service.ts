import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttainmentService {
  constructor(private prisma: PrismaService) {}

  calculateAttainmentLevel(percentage: number): number {
    if (percentage < 50) return 0;
    if (percentage >= 50 && percentage < 60) return 1;
    if (percentage >= 60 && percentage < 70) return 2;
    return 3;
  }

  async calculateDirectAttainment(subjectId: string): Promise<any> {
    const internalAssessment = await this.prisma.assessment.findFirst({
      where: { subjectId, assessmentType: 'INTERNAL' },
      include: { studentMarks: true },
    });

    const externalAssessment = await this.prisma.assessment.findFirst({
      where: { subjectId, assessmentType: 'EXTERNAL' },
      include: { studentMarks: true },
    });

    if (!internalAssessment || !externalAssessment) {
      throw new Error('Both Internal and External assessments are required');
    }

    const internalMarks = internalAssessment.studentMarks;
    const externalMarks = externalAssessment.studentMarks;

    const internalQualified = internalMarks.filter(
      (mark) => (mark.marksObtained / mark.totalMarks) * 100 >= 50
    ).length;

    const externalQualified = externalMarks.filter(
      (mark) => (mark.marksObtained / mark.totalMarks) * 100 >= 50
    ).length;

    const internalPercentage = (internalQualified / internalMarks.length) * 100;
    const externalPercentage = (externalQualified / externalMarks.length) * 100;
    const overallPercentage = (internalPercentage + externalPercentage) / 2;
    const attainmentLevel = this.calculateAttainmentLevel(overallPercentage);

    const attainment = await this.prisma.attainment.upsert({
      where: { subjectId },
      update: {
        internalPercentage,
        externalPercentage,
        overallPercentage,
        attainmentLevel,
      },
      create: {
        subjectId,
        internalPercentage,
        externalPercentage,
        overallPercentage,
        attainmentLevel,
      },
    });

    return {
      subjectId,
      internalPercentage: Math.round(internalPercentage * 100) / 100,
      externalPercentage: Math.round(externalPercentage * 100) / 100,
      overallPercentage: Math.round(overallPercentage * 100) / 100,
      attainmentLevel,
      totalStudents: internalMarks.length,
      qualifiedStudents: internalQualified,
    };
  }

  async getAttainmentBySubjectId(subjectId: string) {
    return this.prisma.attainment.findUnique({
      where: { subjectId },
      include: {
        subject: {
          include: {
            faculty: true,
          },
        },
      },
    });
  }
}
