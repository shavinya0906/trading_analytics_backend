import { Item } from "dynamoose/dist/Item";

export class SessionsEntity extends Item {
	id: string;
    session_startDate: string;
    session_endDate: string;
    session_rating: string;
    session_category: string;
    session_lessonsLearned: string;
    user_id: string
}