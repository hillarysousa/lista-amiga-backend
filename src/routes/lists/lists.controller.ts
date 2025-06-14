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
import { ListsService } from './lists.service';
import { FirebaseAuthGuard } from '../../firebase/firebase-auth.guard';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { CurrentUser } from 'src/firebase/current-user.decorator';

@Controller('list')
export class ListsController {
  constructor(private listsService: ListsService) {}

  @Get()
  findAll() {
    return this.listsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.listsService.findOne(id);
  }

  @Get('user/:userId')
  @UseGuards(FirebaseAuthGuard)
  findUserLists(@CurrentUser('uid') userId: string) {
    return this.listsService.findUserLists(userId);
  }

  @Get('own/:userId')
  @UseGuards(FirebaseAuthGuard)
  findOwnLists(@CurrentUser('uid') userId: string) {
    return this.listsService.findOwnLists(userId);
  }

  @Get('shared/:userId')
  @UseGuards(FirebaseAuthGuard)
  async findSharedLists(@CurrentUser('uid') userId: string) {
    return await this.listsService.findSharedLists(userId);
  }

  @Get(':listId/participants')
  @UseGuards(FirebaseAuthGuard)
  findListParticipants(@Param('listId') listId: string) {
    return this.listsService.findListParticipants(listId);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  create(
    @CurrentUser('uid') uid: string,
    @Body() createListDto: CreateListDto,
  ) {
    return this.listsService.createList(uid, createListDto);
  }

  @Post(':id/share')
  @UseGuards(FirebaseAuthGuard)
  createShareToken(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.listsService.createShareToken(id);
  }

  @Post('join/:shareToken')
  @UseGuards(FirebaseAuthGuard)
  joinListByToken(
    @Param('shareToken') token: string,
    @CurrentUser('uid') uid: string,
  ) {
    return this.listsService.joinListByToken(token, uid);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  edit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listsService.updateList(id, updateListDto);
  }

  @Patch(':id/unshare')
  @UseGuards(FirebaseAuthGuard)
  revokeShareToken(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.listsService.revokeShareToken(id);
  }

  @Patch(':listId/kick/:userId')
  @UseGuards(FirebaseAuthGuard)
  kickUserFromList(
    @Param('listId', new ParseUUIDPipe()) listId: string,
    @Param('userId') userId: string,
  ) {
    return this.listsService.kickUserFromList(listId, userId);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.listsService.deleteList(id);
  }
}
