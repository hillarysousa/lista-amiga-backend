import { DeleteResult, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List as ListInterface } from './lists.interface';
import { List as ListEntity } from './entities/list.entity';
import { User as UserEntity } from '../user/entities/user.entity';
import { AuthService } from '../user/auth.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  private readonly lists: ListInterface[] = [];

  constructor(
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,

    private readonly authService: AuthService,
  ) {}

  findAll(): Promise<ListEntity[]> {
    return this.listRepository.find({
      relations: ['items', 'items.owner', 'owner', 'participants'],
    });
  }

  async findUserLists(userId: string): Promise<ListEntity[]> {
    const ownedLists = await this.listRepository.find({
      where: { owner: { uid: userId } },
      relations: ['items', 'items.owner', 'participants'],
    });

    const sharedLists = await this.listRepository.find({
      where: { participants: { uid: userId } },
      relations: ['items', 'items.owner'],
    });

    return [...ownedLists, ...sharedLists];
  }

  findOwnLists(userId: string): Promise<ListEntity[]> {
    return this.listRepository.find({
      where: { owner: { uid: userId } },
      relations: ['items', 'items.owner', 'participants'],
    });
  }

  findSharedLists(userId: string): Promise<ListEntity[]> {
    return this.listRepository.find({
      where: { participants: { uid: userId } },
      relations: ['items', 'items.owner'],
    });
  }

  async findListParticipants(listId: string): Promise<UserEntity[]> {
    const list = await this.listRepository.findOne({
      where: { id: listId },
      relations: ['participants'],
    });

    if (!list) {
      throw new NotFoundException('Lista não encontrada');
    }

    return list.participants;
  }

  async findOne(listId: string): Promise<ListEntity | null> {
    const result = await this.listRepository.findOne({
      where: { id: listId },
      relations: ['items', 'items.owner', 'participants', 'owner'],
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

  updateList(
    listId: string,
    updateListDto: UpdateListDto,
  ): Promise<ListEntity> {
    const list: ListEntity = new ListEntity();
    list.id = listId;
    list.name = updateListDto.name;

    return this.listRepository.save(list);
  }

  async createShareToken(listId: string): Promise<string> {
    const list = await this.listRepository.findOne({ where: { id: listId } });

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

  async kickUserFromList(listId: string, userId: string): Promise<ListEntity> {
    const list = await this.listRepository.findOne({
      where: { id: listId },
      relations: ['participants'],
    });

    const user = await this.authService.findUser(userId);

    if (!list) {
      throw new NotFoundException('Lista não encontrada');
    }

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isParticipant = list.participants.some((p) => p.uid === userId);

    if (isParticipant) {
      const filteredOutUser = list.participants.filter((u) => u.uid !== userId);
      list.participants = filteredOutUser;
      await this.listRepository.save(list);
    }

    return list;
  }

  deleteList(listId: string): Promise<DeleteResult> {
    return this.listRepository.delete({ id: listId });
  }
}
