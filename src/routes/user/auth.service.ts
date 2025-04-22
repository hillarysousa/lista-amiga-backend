import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FirebaseAdminService } from '../../firebase/firebase-admin.service';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly firebaseAdmin: FirebaseAdminService,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      relations: ['lists', 'sharedLists', 'items'],
    });
  }

  async findOrCreateUser(uid: string): Promise<UserEntity> {
    if (!uid || typeof uid !== 'string' || uid.length > 128) {
      throw new Error('UID inválido');
    }
    let user = await this.userRepository.findOne({ where: { uid } });

    if (!user) {
      const firebaseUser: UserRecord = await this.firebaseAdmin
        .getAuth()
        .getUser(uid);

      user = new UserEntity();
      user.uid = firebaseUser.uid;
      user.name = firebaseUser.displayName ?? '';

      user = await this.userRepository.save(user);
    }

    return user;
  }

  async findUser(uid: string): Promise<UserEntity | null> {
    if (!uid || typeof uid !== 'string' || uid.length > 128) {
      throw new Error('UID inválido');
    }
    return await this.userRepository.findOne({ where: { uid } });
  }
}
