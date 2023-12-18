import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMarketDTO {
  @ApiProperty({
    required: true,
  })
  @IsString()
  Instrument: string;

  @ApiProperty({
    required: true,
  })
  @IsDate()
  Timestamp: Date;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  MarketPrice: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  Volume: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  BidPrice: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  AskPrice: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  HighPrice: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  LowPrice: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  OpenPrice: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  ClosePrice: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  Spread: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  MarketDataStatus: string;
}