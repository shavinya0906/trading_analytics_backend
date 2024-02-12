import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTradeAccountDTO {
  @ApiProperty({
    required: true,
  })
  @IsString()
  account_name: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  trading_account: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  account_client_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  account_email?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  account_mobile?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  purpose?: string;
}
