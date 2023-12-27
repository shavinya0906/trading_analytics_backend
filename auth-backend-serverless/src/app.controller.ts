import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDTO, UpdateUserDTO } from './core/dto/user.dto';
import { UserEntity } from './database/entity/user.entity';
import { LoginUserDTO } from './core/dto/login-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientAuthGuard } from './core/helper/auth.guard';
import { CurrentUser } from './core/decorator/user.decorator';

@ApiTags('Auth/User')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/user/signup')
  async addUser(@Body() data: CreateUserDTO): Promise<UserEntity> {
    return await this.appService.signUp(data);
  }

  @Put('/user/login')
  async loginUser(@Body() data: LoginUserDTO): Promise<any> {
    return await this.appService.loginUser(data);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Put('/update-user/')
  async updateUser(
    @Body() data: UpdateUserDTO,
    @CurrentUser() user: any,
  ): Promise<any> {
    return await this.appService.updateUser(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('/get-user/')
  async getUser(@CurrentUser() user: any): Promise<any> {
    return await this.appService.getUser(user);
  }
}
