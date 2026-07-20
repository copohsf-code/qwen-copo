import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('subjects')
@UseGuards(AuthGuard('jwt'))
export class SubjectsController {
  constructor(private subjectsService: SubjectsService) {}

  @Get()
  async findAll() {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.subjectsService.findById(id);
  }

  @Post()
  async create(@Body() createSubjectDto: any) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSubjectDto: any) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.subjectsService.delete(id);
  }

  @Get('faculty/:facultyId')
  async findByFacultyId(@Param('facultyId') facultyId: string) {
    return this.subjectsService.findByFacultyId(facultyId);
  }

  @Post('bulk')
  async bulkCreate(@Body() subjectsDto: any[]) {
    return this.subjectsService.bulkCreate(subjectsDto);
  }
}
