import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateColumnDTO {
  @ApiProperty({
    required: true,
  })
  @IsString()
  column_name: string;
}