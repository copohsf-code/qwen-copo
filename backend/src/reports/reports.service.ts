import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.report.findMany({
      include: {
        subject: {
          include: {
            faculty: true,
          },
        },
      },
      orderBy: {
        generatedAt: 'desc',
      },
    });
  }

  async findBySubjectId(subjectId: string) {
    return this.prisma.report.findMany({
      where: { subjectId },
      include: {
        subject: {
          include: {
            faculty: true,
          },
        },
      },
      orderBy: {
        generatedAt: 'desc',
      },
    });
  }

  async create(data: any) {
    return this.prisma.report.create({
      data,
      include: {
        subject: true,
      },
    });
  }

  async generateReport(subjectId: string, reportUrl?: string) {
    const existingReports = await this.prisma.report.findMany({
      where: { subjectId },
    });

    if (existingReports.length >= 5) {
      const oldestReport = existingReports[existingReports.length - 1];
      await this.prisma.report.delete({
        where: { id: oldestReport.id },
      });
    }

    return this.prisma.report.create({
      data: {
        subjectId,
        reportUrl: reportUrl || null,
      },
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
