import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTradeAdvanceDTO {
  @ApiProperty({
    required: true,
  })
  @IsString()
  trade_conviction: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  strategy_used: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  trade_risk: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  reason_for_trade: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  percentage_of_account_risked: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  image: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  trade_slippage: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  trade_penalties: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  net_roi: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  trade_customizable: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  opening_balance: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  trade_tags: string;
}

export class UpdateTradeAdvanceDTO {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  trade_conviction: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  strategy_used: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  trade_risk: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  reason_for_trade: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  percentage_of_account_risked: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  trade_slippage: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  trade_penalties: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  net_roi: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  trade_customizable: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  opening_balance: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  trade_tags: string;
}
