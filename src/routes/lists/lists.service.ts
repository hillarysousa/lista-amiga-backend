import { DeleteResult, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List as ListInterface } from './lists.interface';
import { List as ListEntity } from './entities/list.entity';
import { User as UserEntity } from '../user/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  private readonly lists: ListInterface[] = [];

  constructor(
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly authService: AuthService,
  ) {}

  findAll(): Promise<ListEntity[]> {
    return this.listRepository.find({
      relations: ['items', 'owner'],
    });
  }

  findOwnLists(userId: string): Promise<ListEntity[]> {
    return this.listRepository.find({ where: { owner: { uid: userId } } });
  }

  findSharedLists(userId: string): Promise<ListEntity[]> {
    return this.listRepository.find({
      where: { participants: { uid: userId } },
    });
  }

  async findOne(id: string): Promise<ListEntity | null> {
    const result = await this.listRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!result) {
      throw new NotFoundException('Lista não encontrada');
    }
    return result;
  }

  async createList(
    userId: string,
    createListDto: CreateListDto,
  ): Promise<ListEntity> {
    const user = await this.authService.findOrCreateUser(userId);

    const list: ListEntity = new ListEntity();
    list.name = createListDto.name;
    list.owner = user;

    return this.listRepository.save(list);
  }

  updateList(id: string, updateListDto: UpdateListDto): Promise<ListEntity> {
    const list: ListEntity = new ListEntity();
    list.id = id;
    list.name = updateListDto.name;

    return this.listRepository.save(list);
  }

  async createShareToken(id: string): Promise<string> {
    const list = await this.listRepository.findOne({ where: { id } });

    if (!list) {
      throw new NotFoundException('Lista não encontrada');
    }

    list.shareToken = randomUUID();
    await this.listRepository.save(list);

    return list.shareToken;
  }

  async revokeShareToken(listId: string): Promise<void> {
    const list = await this.listRepository.findOne({
      where: { id: listId },
      relations: ['owner'],
    });

    if (!list) {
      throw new NotFoundException('Lista não encontrada');
    }

    list.shareToken = null;

    await this.listRepository.save(list);
  }

  async joinListByToken(token: string, userId: string): Promise<ListEntity> {
    const list = await this.listRepository.findOne({
      where: { shareToken: token },
      relations: ['participants'],
    });

    const user = await this.authService.findUser(userId);

    if (!list) {
      throw new NotFoundException('Lista não encontrada');
    }

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const alreadyParticipant = list.participants.some((p) => p.uid === userId);

    if (!alreadyParticipant) {
      list.participants.push(user);
      await this.listRepository.save(list);
    }

    return list;
  }

  deleteList(id: string): Promise<DeleteResult> {
    return this.listRepository.delete({ id });
  }
}
