import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDTO {  
    @ApiProperty({
        required: true,
    })
    @IsString()
    userId: string;
  
    @ApiProperty({
        required: true,
    })
    @IsString()
    orderType: string;
  
    @ApiProperty({
        required: true,
    })
    @IsString()
    tradingType: string;
  
    @ApiProperty({
        required: true,
    })
    @IsNumber()
    quantity: number;
  
    @ApiProperty({
        required: true,
    })
    @IsString()
    priceType: string;
  
    @ApiProperty({
        required: true,
    })
    @IsNumber()
    price: number;
  
    @ApiProperty({
        required: false,
    })
    @IsString()
    stopLossType: string;
  
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    stopLossPrice: number;
  
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    triggerPrice: number;
  
    @ApiProperty({
        required: true,
    })
    @IsDate()
    time: Date;
  
    @ApiProperty({
        required: true,
    })
    @IsString()
    instrument: string;

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    LTP: number;
  
    @ApiProperty({
        required: true,
    })
    @IsString()
    product: string;
  
    @ApiProperty({
        required: true,
    })
    @IsString()
    status: string;

    @ApiProperty({
        required: true,
    })
    @IsString()
    tradingStyle: string;
}