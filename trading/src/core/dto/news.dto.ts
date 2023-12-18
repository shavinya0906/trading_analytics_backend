import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNewsDTO {
  @ApiProperty({
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  content: string;

  @ApiProperty({
    required: true,
  })
  @IsDate()
  publish_date: Date;

  @ApiProperty({
    required: true,
  })
  @IsString()
  author: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  category: string;
}
