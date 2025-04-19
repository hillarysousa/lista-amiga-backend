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
@UseGuards(FirebaseAuthGuard)
export class ListsController {
  constructor(private listsService: ListsService) {}

  @Get()
  findAll() {
    return this.listsService.findAll();
  }

  @Get('own')
  findOwnLists(@CurrentUser('uid') userId: string) {
    return this.listsService.findOwnLists(userId);
  }

  @Get('shared')
  findSharedLists(@CurrentUser('uid') userId: string) {
    return this.listsService.findSharedLists(userId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.listsService.findOne(id);
  }

  @Post()
  create(
    @CurrentUser('uid') uid: string,
    @Body() createListDto: CreateListDto,
  ) {
    return this.listsService.createList(uid, createListDto);
  }

  @Post('share/:id')
  createShareToken(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.listsService.createShareToken(id);
  }

  @Post('join/:shareToken')
  joinListByToken(
    @Param('token', new ParseUUIDPipe()) token: string,
    @CurrentUser('uid') uid: string,
  ) {
    return this.listsService.joinListByToken(token, uid);
  }

  @Patch(':id')
  edit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listsService.updateList(id, updateListDto);
  }

  @Patch('unshare/:id')
  revokeShareToken(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.listsService.revokeShareToken(id);
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.listsService.deleteList(id);
  }
}
