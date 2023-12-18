import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExcelDTO {
    @ApiProperty({
        required: false,
    })
    @IsDate()
    date: Date;

    @ApiProperty({
        required: false,
    })
    @IsNumber()
    close: number;

    @ApiProperty({
        required: false,
    })
    @IsNumber()
    high: number;

    @ApiProperty({
        required: false,
    })
    @IsNumber()
    low: number;

    @ApiProperty({
        required: false,
    })
    @IsNumber()
    open: number;
    
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    volume: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    sma5: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    sma10: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    sma15: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    sma20: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    ema5: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    ema10: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    ema15: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    ema20: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    upperband: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    middleband: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    lowerband: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    HT_TRENDLINE: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    KAMA10: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    KAMA20: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    KAMA30: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    SAR: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    TRIMA5: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    TRIMA10: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    TRIMA20: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    ADX5: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    ADX10: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    ADX20: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    APO: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    CCI5: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    CCI10: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    CCI15: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    macd510: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    macd520: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    macd1020: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    macd1520: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    macd1226: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    MFI: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    MOM10: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    MOM15: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    MOM20: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    ROC5: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    ROC10: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    ROC20: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    PPO: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    RSI14: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    RSI8: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    slowk: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    slowd: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    fastk: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    fastd: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    fastksr: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    fastdsr: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    ULTOSC: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    WILLR: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    ATR: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    Trange: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    TYPPRICE: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    HT_DCPERIOD: number;
    @ApiProperty({
        required: false,
    })
    @IsNumber()
    BETA: number;
    @ApiProperty({
        required: false,
    })
    @IsString()
    instrument: string;

}