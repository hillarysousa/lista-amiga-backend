import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CurrentUser } from 'src/firebase/current-user.decorator';

@Controller('item')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.itemsService.findOne(id);
  }

  @Get('findByList/:listId')
  findAllByListId(@Param('listId', new ParseUUIDPipe()) listId: string) {
    return this.itemsService.findAllByListId(listId);
  }

  @Get('own')
  findOwnItems(@CurrentUser('uid') userId: string) {
    return this.itemsService.findOwnItems(userId);
  }

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.createItem(createItemDto);
  }

  @Patch(':id')
  edit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.updateItem(id, updateItemDto);
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.itemsService.deleteItem(id);
  }
}
