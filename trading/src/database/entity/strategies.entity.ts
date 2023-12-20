import { Item } from 'dynamoose/dist/Item';

export class StrategiesEntity extends Item {
  id: string;
  strategies_name: string;
  user_id: string;
  strategies_desc: string;
}
