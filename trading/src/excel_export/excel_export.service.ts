import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Buffer } from 'buffer';

@Injectable()
export class ExcelExportService {
  async exportToExcel(data: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');
    worksheet.columns = Object.keys(data[0]).map((header) => ({
      header,
      key: header,
    }));
    data.forEach((item) => {
      worksheet.addRow(Object.values(item));
    });
    const headerStyle = { font: { bold: true } };
    worksheet.getRow(1).eachCell((cell) => {
      cell.style = headerStyle;
    });
    const buffer: any = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
