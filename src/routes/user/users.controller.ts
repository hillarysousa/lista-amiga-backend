import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../firebase/firebase-auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from '../../firebase/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.authService.findUser(id);
  }

  @Post('create')
  @UseGuards(FirebaseAuthGuard)
  async createUser(@CurrentUser('uid') userId: string) {
    return await this.authService.findOrCreateUser(userId);
  }
}
