import { Item } from "dynamoose/dist/Item";

export class StrategiesEntity extends Item {
	strategies_Id: string;
    strategies_name: string;
    user_id: string
}