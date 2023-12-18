import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as dynamoose from 'dynamoose';
import { Model } from 'dynamoose/dist/Model';
import { CreateNewsDTO } from 'src/core/dto/news.dto';
import { NewsEntity } from 'src/database/entity';
import { NewsSchema } from 'src/database/schema';

@Injectable()
export class NewsService {
  private newsInstance: Model<NewsEntity>;
  constructor() {
    this.newsInstance = dynamoose.model<NewsEntity>('news', NewsSchema);
  }
  async createNews(data: CreateNewsDTO) {
    try {
      return await this.newsInstance.create({
        title: data.title,
        content: data.content,
        publish_date: data.publish_date,
        author: data.author,
        category: data.category,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getNews() {
    try {
      return await this.newsInstance.scan().exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteNews(id: string) {
    try {
      const newsData = await this.newsInstance.get(id);
      if (!newsData) {
        return {
          status: 500,
          message: 'No order found',
        };
      }
      await this.newsInstance.delete(newsData.news_Id);
      return {
        status: 200,
        message: 'order is deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
