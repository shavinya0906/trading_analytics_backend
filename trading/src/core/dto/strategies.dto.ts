import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateStrategiesDTO {
  @ApiProperty({
    required: true,
  })
  @IsString()
  strategies_name: string;
  @ApiProperty({
    // required: true,
  })
  @IsString()
  strategies_desc: string;
}
