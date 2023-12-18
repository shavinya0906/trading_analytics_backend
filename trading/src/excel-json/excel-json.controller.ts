import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelJsonService } from './excel-json.service';
import { diskStorage } from 'multer';
import path from 'path';

@Controller('excel-json')
export class ExcelJsonController {
  constructor(private readonly excelJsonService: ExcelJsonService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      return { message: 'No file uploaded' };
    }
    const jsonData = this.excelJsonService.convertExcelToJson(file.path);
    for (let index = 0; index < jsonData.length; index++) {
      jsonData[index]['instrument'] = 'nifty 50';
    }
    await this.excelJsonService.insertData(jsonData);
    return { message: 'Data inserted into DynamoDB' };
  }
}
