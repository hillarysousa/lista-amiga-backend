import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { List } from '../lists/entities/list.entity';
import { AuthService } from '../user/auth.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [FirebaseModule, TypeOrmModule.forFeature([Item, List, User])],
  controllers: [ItemsController],
  providers: [ItemsService, AuthService],
})
export class ItemsModule {}
