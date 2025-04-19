import { Injectable } from '@nestjs/common';
import { Item as ItemInterface } from './items.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Item as ItemEntity } from './entities/item.entity';
import { List as ListEntity } from '../lists/entities/list.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ItemsService {
  private readonly items: ItemInterface[] = [];

  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,

    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,

    private readonly authService: AuthService,
  ) {}

  findAll(): Promise<ItemEntity[]> {
    return this.itemRepository.find({ relations: ['list'] });
  }

  findOne(id: string): Promise<ItemEntity | null> {
    return this.itemRepository.findOne({
      where: { id },
      relations: ['list'],
    });
  }

  async findAllByListId(listId: string): Promise<ItemEntity[]> {
    const list = await this.listRepository.findOne({ where: { id: listId } });

    if (!list) {
      throw new Error('Lista não encontrada');
    }

    return this.itemRepository.find({
      where: { list: { id: listId } },
      relations: ['list'],
    });
  }

  async findOwnItems(userId: string): Promise<ItemEntity[]> {
    const user = await this.authService.findUser(userId);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return this.itemRepository.find({
      where: { owner: { uid: userId } },
    });
  }

  async createItem(createItemDto: CreateItemDto): Promise<ItemEntity> {
    const list = await this.listRepository.findOne({
      where: { id: createItemDto.listId },
    });

    if (!list) {
      throw new Error('Lista não encontrada!');
    }

    const item: ItemEntity = new ItemEntity();
    item.name = createItemDto.name;
    item.list = list;

    return this.itemRepository.save(item);
  }

  updateItem(id: string, updateItemDto: UpdateItemDto): Promise<ItemEntity> {
    const item: ItemEntity = new ItemEntity();
    item.id = id;
    item.name = updateItemDto.name;

    return this.itemRepository.save(item);
  }

  deleteItem(id: string): Promise<DeleteResult> {
    return this.itemRepository.delete({ id });
  }
}
