import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item as ItemEntity } from './entities/item.entity';
import { List as ListEntity } from '../lists/entities/list.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthService } from '../user/auth.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,

    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,

    private readonly authService: AuthService,
  ) {}

  findAll(): Promise<ItemEntity[]> {
    return this.itemRepository.find({ relations: ['list', 'owner'] });
  }

  findOne(itemId: string): Promise<ItemEntity | null> {
    return this.itemRepository.findOne({
      where: { id: itemId },
      relations: ['list', 'owner'],
    });
  }

  async findAllByListId(listId: string): Promise<ItemEntity[]> {
    const list = await this.listRepository.findOne({ where: { id: listId } });

    if (!list) {
      throw new NotFoundException('Lista não encontrada');
    }

    return this.itemRepository.find({
      where: { list: { id: listId } },
      relations: ['list', 'owner'],
    });
  }

  async findOwnItems(userId: string): Promise<ItemEntity[]> {
    return this.itemRepository.find({
      where: { owner: { uid: userId } },
      relations: ['list', 'owner'],
    });
  }

  async createItem(createItemDto: CreateItemDto): Promise<ItemEntity> {
    const list = await this.listRepository.findOne({
      where: { id: createItemDto.listId },
    });

    if (!list) {
      throw new NotFoundException('Lista não encontrada');
    }

    const item: ItemEntity = new ItemEntity();
    item.name = createItemDto.name;
    item.list = list;

    return this.itemRepository.save(item);
  }

  updateItem(
    itemId: string,
    updateItemDto: UpdateItemDto,
  ): Promise<ItemEntity> {
    const item: ItemEntity = new ItemEntity();
    item.id = itemId;
    item.name = updateItemDto.name;

    return this.itemRepository.save(item);
  }

  async checkItem(itemId: string, userId: string) {
    const item = await this.itemRepository.findOne({
      where: { id: itemId },
      relations: ['owner'],
    });
    const user = await this.authService.findUser(userId);
    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.uid !== userId) {
      throw new UnauthorizedException('Usuário não é dono do item');
    }

    item.checked = true;

    return this.itemRepository.save(item);
  }

  async uncheckItem(itemId: string, userId: string) {
    const item = await this.itemRepository.findOne({
      where: { id: itemId },
      relations: ['owner'],
    });
    const user = await this.authService.findUser(userId);
    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.uid !== userId) {
      throw new UnauthorizedException('Usuário não é dono do item');
    }

    item.checked = false;

    return this.itemRepository.save(item);
  }

  async setItemOwner(itemId: string, userId: string): Promise<ItemEntity> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId },
      relations: ['owner'],
    });
    const user = await this.authService.findUser(userId);
    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    item.owner = user;

    return this.itemRepository.save(item);
  }

  async removeItemOwner(itemId: string, userId: string): Promise<ItemEntity> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId },
      relations: ['owner'],
    });
    const user = await this.authService.findUser(userId);

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isUserOwner = item.owner?.uid === user.uid;

    if (isUserOwner) {
      item.owner = null;
      await this.itemRepository.save(item);
    }

    return item;
  }

  deleteItem(itemId: string): Promise<DeleteResult> {
    return this.itemRepository.delete({ id: itemId });
  }
}
