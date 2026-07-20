import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { COService } from './co.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('co')
@UseGuards(AuthGuard('jwt'))
export class COController {
  constructor(private coService: COService) {}

  @Get()
  async findAll() {
    return this.coService.findAll();
  }

  @Get('subject/:subjectId')
  async findBySubjectId(@Param('subjectId') subjectId: string) {
    return this.coService.findBySubjectId(subjectId);
  }

  @Post()
  async create(@Body() createCoDto: any) {
    return this.coService.create(createCoDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCoDto: any) {
    return this.coService.update(id, updateCoDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.coService.delete(id);
  }

  @Post('bulk')
  async bulkCreate(@Body() cosDto: any[]) {
    return this.coService.bulkCreate(cosDto);
  }
}
