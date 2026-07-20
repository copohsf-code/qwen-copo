import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacultyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.faculty.findMany({
      include: {
        user: true,
        subjects: true,
      },
    });
  }

  async findById(id: string) {
    const faculty = await this.prisma.faculty.findUnique({
      where: { id },
      include: {
        user: true,
        subjects: true,
      },
    });
    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }
    return faculty;
  }

  async create(data: any) {
    return this.prisma.faculty.create({
      data: {
        ...data,
        user: {
          create: {
            email: data.email,
            password: data.password || 'defaultPassword123',
            name: data.name,
            role: 'FACULTY',
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: string, data: any) {
    const faculty = await this.prisma.faculty.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        facultyCode: data.facultyCode,
      },
      include: {
        user: true,
      },
    });
    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }
    return faculty;
  }

  async delete(id: string) {
    await this.prisma.faculty.delete({
      where: { id },
    });
    return { message: 'Faculty deleted successfully' };
  }

  async findByUserId(userId: string) {
    return this.prisma.faculty.findUnique({
      where: { userId },
      include: {
        subjects: true,
      },
    });
  }
}
