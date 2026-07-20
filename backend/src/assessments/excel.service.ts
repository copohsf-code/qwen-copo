import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelService {
  async parseExcelFile(buffer: Buffer): Promise<any[]> {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      return data;
    } catch (error) {
      throw new BadRequestException('Invalid Excel file format');
    }
  }

  validateAssessmentData(data: any[], type: 'INTERNAL' | 'EXTERNAL'): void {
    const requiredColumns = ['Roll Number', 'Student Name', 'Marks Obtained', 'Total Marks'];
    
    if (data.length === 0) {
      throw new BadRequestException('Excel file is empty');
    }

    const firstRow = data[0];
    for (const column of requiredColumns) {
      if (!(column in firstRow)) {
        throw new BadRequestException(`Missing required column: ${column}`);
      }
    }

    const rollNumbers = new Set<string>();
    for (const row of data) {
      if (!row['Roll Number'] || !row['Student Name']) {
        throw new BadRequestException('Roll Number and Student Name are required');
      }

      if (rollNumbers.has(row['Roll Number'])) {
        throw new BadRequestException(`Duplicate Roll Number: ${row['Roll Number']}`);
      }
      rollNumbers.add(row['Roll Number']);

      const marksObtained = parseFloat(row['Marks Obtained']);
      const totalMarks = parseFloat(row['Total Marks']);

      if (isNaN(marksObtained) || isNaN(totalMarks)) {
        throw new BadRequestException('Invalid marks value');
      }

      if (marksObtained < 0 || totalMarks < 0) {
        throw new BadRequestException('Marks cannot be negative');
      }

      if (marksObtained > totalMarks) {
        throw new BadRequestException(`Marks obtained cannot exceed total marks for ${row['Student Name']}`);
      }
    }
  }

  generateExcelBuffer(data: any[]): Buffer {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}
