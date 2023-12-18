import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'dynamoose/dist/Model';
import { UserEntity } from './database/entity/user.entity';
import * as dynamoose from 'dynamoose';
import { UserSchema } from './database/schema/user.schema';
import { generateToken } from './core/helper/jwt.helper';
import { CreateUserDTO, UpdateUserDTO } from './core/dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDTO } from './core/dto/login-user.dto';

@Injectable()
export class AppService {
  private userInstance: Model<UserEntity>;
  constructor() {
    const tableName = 'users';
    this.userInstance = dynamoose.model<UserEntity>(tableName, UserSchema);
  }
  async signUp(createUserDto: CreateUserDTO) {
    try {
      console.log('DATA', createUserDto);
      return await this.userInstance.create({
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
        email: createUserDto.email,
        avatar: createUserDto.avatar,
        mobile: createUserDto.mobile,
        password: bcrypt.hashSync(createUserDto.password, 8),
        status: createUserDto.status,
        role: createUserDto.role,
        is_third_party_login: createUserDto.is_third_party_login,
        third_party_token: createUserDto.third_party_token,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDTO) {
    try {
      const [userData] = await this.userInstance
        .scan()
        .where('email')
        .eq(loginUserDto.email)
        .exec();
      if (!userData) {
        return {
          status: 404,
          message: 'User not found',
        };
      }
      if (!bcrypt.compareSync(loginUserDto.password, userData.password)) {
        return {
          status: 500,
          message: 'Invalid password',
        };
      }
      const token = await generateToken(userData);
      const dataatAfterUpdate = await this.userInstance.update(
        { id: userData.id },
        { auth_token: token },
      );
      return await this.userInstance.get(userData.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateUser(data: UpdateUserDTO, user: any) {
    try {
      await this.userInstance.update({ id: user.id }, { ...data });
      return await this.userInstance.get(user.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUser(user: any) {
    try {
      return await this.userInstance.get(user.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
