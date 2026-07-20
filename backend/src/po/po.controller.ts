import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { POService } from './po.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('po')
@UseGuards(AuthGuard('jwt'))
export class POController {
  constructor(private poService: POService) {}

  @Get()
  async findAll() {
    return this.poService.findAll();
  }

  @Get('subject/:subjectId')
  async findBySubjectId(@Param('subjectId') subjectId: string) {
    return this.poService.findBySubjectId(subjectId);
  }

  @Post()
  async create(@Body() createPoDto: any) {
    return this.poService.create(createPoDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePoDto: any) {
    return this.poService.update(id, updatePoDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.poService.delete(id);
  }

  @Post('bulk')
  async bulkCreate(@Body() posDto: any[]) {
    return this.poService.bulkCreate(posDto);
  }
}
