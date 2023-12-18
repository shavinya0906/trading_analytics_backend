import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    required: true,
  })
  @IsString()
  public first_name: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  public last_name: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  public avatar: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  public password: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  public status: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  public email: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  public mobile: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  public role: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  public is_third_party_login: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  public third_party_token: string;
}

export class UpdateUserDTO {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  public first_name: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  public last_name: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  public avatar: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  public mobile: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  public role: string;
}
