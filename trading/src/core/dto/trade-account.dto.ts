import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTradeAccountDTO {
  @ApiProperty({
    required: true,
  })
  @IsString()
  trading_account: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  user_id: string;
}