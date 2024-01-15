import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMantrasDTO {
  @ApiProperty({
    required: true,
  })
  @IsString()
  mantras_desc: string;
}
