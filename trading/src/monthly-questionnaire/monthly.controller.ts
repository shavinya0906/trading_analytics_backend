import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    ValidationPipe,
  } from '@nestjs/common';
  import { MonthlyQuestionnaireService } from './monthly.service';
  import { CreateMonthlyQuestionnaireDTO } from 'src/core/dto/monthly.dto';
  import { ApiBearerAuth } from '@nestjs/swagger';
  import { ClientAuthGuard } from 'src/core/helper/auth.guard';
  import { CurrentUser } from 'src/core/decorator/user.decorator';
  import { GetByIdDTO } from 'src/core/dto/get-by-id.dto';
  
  @Controller('monthly-questionnaire')
  export class MonthlyQuestionnaireController {
    constructor(
      private readonly questionnaireService: MonthlyQuestionnaireService,
    ) {}
  
    @ApiBearerAuth()
    @UseGuards(ClientAuthGuard)
    @Post('/')
    async createMonthlyQuestionnaire(
      @Body(ValidationPipe) data: CreateMonthlyQuestionnaireDTO,
      @CurrentUser() user: any,
    ): Promise<any> {
      return await this.questionnaireService.createMonthlyQuestionnaire(data, user);
    }
  
    @ApiBearerAuth()
    @UseGuards(ClientAuthGuard)
    @Get('/')
    async getAllMonthlyQuestionnaires(): Promise<any> {
      return await this.questionnaireService.getMonthlyQuestionnaires();
    }
  
    @ApiBearerAuth()
    @UseGuards(ClientAuthGuard)
    @Delete('/:id')
    async deleteMonthlyQuestionnaire(@Param() id: string): Promise<any> {
      return await this.questionnaireService.deleteMonthlyQuestionnaire(id);
    }
  
    @ApiBearerAuth()
    @UseGuards(ClientAuthGuard)
    @Put('/update/:id')
    async updateMonthlyQuestionnaire(
      @Param() id,
      @Body() data: any,
      @CurrentUser() user: any,
    ): Promise<any> {
      return await this.questionnaireService.updateMonthlyQuestionnaire(id.id, data, user);
    }
  }
  