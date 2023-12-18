import { Module } from '@nestjs/common';
import { UserColumnController } from './user_column.controller';
import { UserColumnService } from './user_column.service';

@Module({
  controllers: [UserColumnController],
  providers: [UserColumnService]
})
export class UserColumnModule {
  
}
