import { Injectable } from '@nestjs/common';
import { List as ListInterface } from './lists.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { List, List as ListEntity } from './entities/list.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  private readonly lists: ListInterface[] = [];

  constructor(
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,
  ) {}

  findAll(): Promise<ListEntity[]> {
    return this.listRepository.find();
  }

  findOne(id: string): Promise<ListEntity | null> {
    return this.listRepository.findOneBy({ id });
  }

  createList(createListDto: CreateListDto): Promise<ListEntity> {
    const list: List = new List();
    list.name = createListDto.name;
    list.items = createListDto.items;

    return this.listRepository.save(list);
  }

  updateList(id: string, updateListDto: UpdateListDto): Promise<ListEntity> {
    const list: List = new List();
    list.id = id;
    list.name = updateListDto.name;

    return this.listRepository.save(list);
  }

  deleteList(id: string): Promise<DeleteResult> {
    return this.listRepository.delete({ id });
  }
}
