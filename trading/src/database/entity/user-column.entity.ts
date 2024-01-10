import { Item } from "dynamoose/dist/Item";

export class UserColumnEntity extends Item {
    id: string;
    user_id: string;
	column_name: string;
}