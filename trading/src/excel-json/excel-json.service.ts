import * as fs from 'fs';
import * as xlsx from 'xlsx';
import { Injectable } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import * as dynamoose from 'dynamoose';
import { ExcelEntity } from 'src/database/entity';
import { ExcelSchema } from 'src/database/schema';
// import { CreateExcelDTO } from 'src/core/dto';

@Injectable()
export class ExcelJsonService {
  private excelInstance: Model<ExcelEntity>;
  constructor() {
    this.excelInstance = dynamoose.model<ExcelEntity>('trade-log', ExcelSchema);
  }
  convertExcelToJson(filePath: string): any[] {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet

    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return sheetData;
  }

  async insertData(objects: any[]): Promise<void> {
    for (const obj of objects) {
        await this.excelInstance.create(obj);
    }
  }
}
