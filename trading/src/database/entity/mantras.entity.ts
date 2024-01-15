import { Item } from 'dynamoose/dist/Item';

export class MantrasEntity extends Item {
  id: string;
  user_id: string;
  mantras_desc: string;
}
