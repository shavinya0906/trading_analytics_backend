import { Item } from "dynamoose/dist/Item";

export class TradeAccountEntity extends Item {
	account_Id: string;
    trading_account: string;
    user_id: string
}