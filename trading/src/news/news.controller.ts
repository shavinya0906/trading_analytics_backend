import { Body, Controller, Delete, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientAuthGuard } from 'src/core/helper/auth.guard';
import { CreateNewsDTO } from 'src/core/dto/news.dto';
import { GetByIdDTO } from 'src/core/dto/get-by-id.dto';

@ApiTags('news')
@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Post('/')
  async createNews(
    @Body(ValidationPipe) data: CreateNewsDTO,
  ): Promise<any> {
    return await this.newsService.createNews(data);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/')
  async getAllNews(): Promise<any> {
    return await this.newsService.getNews();
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async deleteNews(
    @Param() id: GetByIdDTO,
  ): Promise<any> {
    return await this.newsService.deleteNews(id.id);
  }
}
