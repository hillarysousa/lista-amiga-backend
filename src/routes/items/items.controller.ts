import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CurrentUser } from 'src/firebase/current-user.decorator';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';

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

  @Get('own/:userId')
  @UseGuards(FirebaseAuthGuard)
  findOwnItems(@CurrentUser('uid') userId: string) {
    return this.itemsService.findOwnItems(userId);
  }

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.createItem(createItemDto);
  }

  @Post(':id/setOwner')
  @UseGuards(FirebaseAuthGuard)
  setItemOwner(@Param('id') id: string, @CurrentUser('uid') userId: string) {
    return this.itemsService.setItemOwner(id, userId);
  }

  @Patch(':id')
  edit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.updateItem(id, updateItemDto);
  }

  @Patch(':id/check')
  @UseGuards(FirebaseAuthGuard)
  checkItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser('uid') userId: string,
  ) {
    return this.itemsService.checkItem(id, userId);
  }

  @Patch(':id/uncheck')
  @UseGuards(FirebaseAuthGuard)
  uncheckItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser('uid') userId: string,
  ) {
    return this.itemsService.uncheckItem(id, userId);
  }

  @Patch(':id/removeOwner/:userId')
  removeItemOwner(@Param('id') id: string, @Param('userId') userId: string) {
    return this.itemsService.removeItemOwner(id, userId);
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.itemsService.deleteItem(id);
  }
}
