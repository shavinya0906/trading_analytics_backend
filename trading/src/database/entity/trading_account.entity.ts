import { Item } from "dynamoose/dist/Item";

export class TradeAccountEntity extends Item {
	id: string;
    account_client_id: string;
    account_email:string;
    account_mobile:string;
    account_name:string;
    purpose:string;
    trading_account:string;
    user_id: string
}