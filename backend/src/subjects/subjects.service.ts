import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.subject.findMany({
      include: {
        faculty: true,
      },
    });
  }

  async findById(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        faculty: true,
        assessments: true,
        attainment: true,
      },
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async create(data: any) {
    return this.prisma.subject.create({
      data,
      include: {
        faculty: true,
      },
    });
  }

  async update(id: string, data: any) {
    const subject = await this.prisma.subject.update({
      where: { id },
      data,
      include: {
        faculty: true,
      },
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async delete(id: string) {
    await this.prisma.subject.delete({
      where: { id },
    });
    return { message: 'Subject deleted successfully' };
  }

  async findByFacultyId(facultyId: string) {
    return this.prisma.subject.findMany({
      where: { facultyId },
      include: {
        faculty: true,
      },
    });
  }

  async bulkCreate(subjects: any[]) {
    return this.prisma.subject.createMany({
      data: subjects,
      skipDuplicates: true,
    });
  }
}
