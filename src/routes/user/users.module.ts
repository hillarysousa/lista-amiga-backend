import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './users.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthService } from './auth.service';

@Module({
  imports: [FirebaseModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [AuthService],
})
export class UsersModule {}
