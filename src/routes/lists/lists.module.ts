import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { User } from '../user/entities/user.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [FirebaseModule, TypeOrmModule.forFeature([List, User])],
  controllers: [ListsController],
  providers: [ListsService, AuthService],
})
export class ListsModule {}
