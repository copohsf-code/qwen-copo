import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class POService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.po.findMany({
      include: {
        subject: true,
      },
    });
  }

  async findBySubjectId(subjectId: string) {
    return this.prisma.po.findMany({
      where: { subjectId },
      include: {
        subject: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.po.create({
      data,
      include: {
        subject: true,
      },
    });
  }

  async update(id: string, data: any) {
    const po = await this.prisma.po.update({
      where: { id },
      data,
      include: {
        subject: true,
      },
    });
    if (!po) {
      throw new NotFoundException(`PO with ID ${id} not found`);
    }
    return po;
  }

  async delete(id: string) {
    await this.prisma.po.delete({
      where: { id },
    });
    return { message: 'PO deleted successfully' };
  }

  async bulkCreate(pos: any[]) {
    return this.prisma.po.createMany({
      data: pos,
      skipDuplicates: true,
    });
  }
}
