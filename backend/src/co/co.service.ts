import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class COService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.co.findMany({
      include: {
        subject: true,
      },
    });
  }

  async findBySubjectId(subjectId: string) {
    return this.prisma.co.findMany({
      where: { subjectId },
      include: {
        subject: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.co.create({
      data,
      include: {
        subject: true,
      },
    });
  }

  async update(id: string, data: any) {
    const co = await this.prisma.co.update({
      where: { id },
      data,
      include: {
        subject: true,
      },
    });
    if (!co) {
      throw new NotFoundException(`CO with ID ${id} not found`);
    }
    return co;
  }

  async delete(id: string) {
    await this.prisma.co.delete({
      where: { id },
    });
    return { message: 'CO deleted successfully' };
  }

  async bulkCreate(cos: any[]) {
    return this.prisma.co.createMany({
      data: cos,
      skipDuplicates: true,
    });
  }
}
