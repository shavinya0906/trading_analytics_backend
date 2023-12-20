import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSessionsDTO {
  @ApiProperty({
    required: true,
  })
  @IsString()
  session_startDate: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  session_endDate: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  session_rating: string;
  @ApiProperty({
    required: true,
  })
  @IsString()
  session_category: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  session_lessonsLearned: string;
}