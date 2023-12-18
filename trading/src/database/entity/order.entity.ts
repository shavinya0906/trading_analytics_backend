import { Item } from "dynamoose/dist/Item";

export class OrderEntity extends Item {
    orderId : string;     
	userId: string;  			
	orderType: string;        			
	tradingType: string;      			
	quantity: number;         			
	priceType: string;       			
	price: number;             			
	stopLossType: string;     			
	stopLossPrice: number;
	triggerPrice: number;  			
	time: Date;			
	instrument: string;						
	LTP: number; 							
	product: string; 						
	status: string;
    tradingStyle: string;						
}