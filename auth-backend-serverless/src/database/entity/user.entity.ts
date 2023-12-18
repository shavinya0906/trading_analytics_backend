import { Item } from 'dynamoose/dist/Item';

export class UserEntity extends Item {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  avatar: string;
  password: string;
  status: string;
  is_third_party_login: string;
  third_party_token: string;
  role: string;
  auth_token: string;
}
