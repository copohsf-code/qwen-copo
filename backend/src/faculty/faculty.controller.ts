import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('faculty')
@UseGuards(AuthGuard('jwt'))
export class FacultyController {
  constructor(private facultyService: FacultyService) {}

  @Get()
  async findAll() {
    return this.facultyService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.facultyService.findById(id);
  }

  @Post()
  async create(@Body() createFacultyDto: any) {
    return this.facultyService.create(createFacultyDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateFacultyDto: any) {
    return this.facultyService.update(id, updateFacultyDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.facultyService.delete(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.facultyService.findByUserId(userId);
  }
}
