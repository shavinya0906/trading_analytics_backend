import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTradeDTO {
  @ApiProperty({
    required: false,
  })
  @IsString()
  asset_class: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  position_size: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  points_captured: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  trade_pnl: number; 

  @ApiProperty({
    required: true,
  })
  @IsString()
  position: string;  

  @ApiProperty({
    required: true,
  })
  @IsString()
  buy_sell: string; 

  @IsString()
  trade_remark: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  trade_karma: string;

  @ApiProperty({
    required: true, //required
  })
  @IsString()
  trade_date: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  holding_trade_type: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  trade_charges: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  trading_account: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  stop_loss: number;

  @IsString()
  trade_target: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  trade_conviction: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  strategy_used: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  trade_risk: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  reason_for_trade: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  percentage_of_account_risked: number;

  @IsString()
  image: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  trade_slippage: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  trade_penalties: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  net_roi: number;

  @IsString()
  trade_customizable: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  opening_balance: number;

  @IsString()
  trade_tags: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  comment: string;

  @ApiProperty({
    required: false,
  })
  @IsArray()
  dynamicColumn: any[];

  @IsString()
  emotion_influence: string;

  @IsString()
  follow_plan: string;

  @IsString()
  confidence_on_decisions: string;

  @IsString()
  experience_regret: string;

  @IsString()
  take_unnecessary_risks: string;

  @IsString()
  feel_anxious_or_stressed: string;

  @IsString()
  attached_or_averse_to_stocks: string;

  @IsString()
  ideas_for_future_improvements: string;
}

export class UpdateTradeDTO {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  asset_class: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  position_size: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  points_captured: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  trade_pnl: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  position: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  buy_sell: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  trade_remark: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  trade_karma: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  trade_date: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  holding_trade_type: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  trade_charges: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  trading_account: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  stop_loss: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  trade_target: number;

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

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  comment: string;

  @ApiProperty({
    required: false,
  })
  @IsArray()
  dynamicColumn: any[];  

  @IsOptional()
  @IsString()
  emotion_influence: string;

  @IsOptional()
  @IsString()
  follow_plan: string;

  @IsOptional()
  @IsString()
  confidence_on_decisions: string;

  @IsOptional()
  @IsString()
  experience_regret: string;

  @IsOptional()
  @IsString()
  take_unnecessary_risks: string;

  @IsOptional()
  @IsString()
  feel_anxious_or_stressed: string;

  @IsOptional()
  @IsString()
  attached_or_averse_to_stocks: string;

  @IsOptional()
  @IsString()
  ideas_for_future_improvements: string;
}
