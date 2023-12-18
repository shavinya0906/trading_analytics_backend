import { Item } from "dynamoose/dist/Item";


export class MarketEntity extends Item {
    MarketDataID: string; // Primary Key
    Instrument: string;
    Timestamp: Date;
    MarketPrice: Number;
    Volume: Number;
    BidPrice: Number;
    AskPrice: Number;
    HighPrice: Number;
    LowPrice: Number;
    OpenPrice: Number;
    ClosePrice: Number;
    Spread: Number;
    MarketDataStatus: string;
}