import {
  Controller,
  Post,
  UseGuards,
  Body,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClientAuthGuard } from '../core/helper/auth.guard'; // Update this with the correct path
import { CurrentUser } from 'src/core/decorator/user.decorator';
import { TradeService } from './tradebook.service'; // Update this with the correct path
import { Express } from 'express'; // Update this with the correct path

@Controller('tradebook')
export class TradeController {
  constructor(private readonly tradebookService: TradeService) {}

  // Existing code...

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file')) // Use FileInterceptor for file uploads
  async uploadTradebook(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File, // Add this parameter for the uploaded file
  ): Promise<any> {
    // Check if a file is uploaded
    if (file) {
      // Pass the file to the service for processing
      return await this.tradebookService.uploadTradeFile(user, file);
    }
  }
  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/get')
  async getTradebook(@CurrentUser() user: any): Promise<any> {
    return await this.tradebookService.getExistingFileURL(user);
  }
}

//setting route for extracting existing file
