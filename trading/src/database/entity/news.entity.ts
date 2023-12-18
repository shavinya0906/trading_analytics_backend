import { Item } from "dynamoose/dist/Item";

export class NewsEntity extends Item {
    news_Id: string;
	title: string;
	content: string;
	publish_date: Date;
	author: string;
	category: string;	
}