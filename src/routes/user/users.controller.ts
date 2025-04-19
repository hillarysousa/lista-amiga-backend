import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../firebase/firebase-auth.guard';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../../firebase/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('profile')
  async getUserProfile(@CurrentUser('uid') userId: string) {
    const userEntity = await this.authService.findOrCreateUser(userId);
    return userEntity;
  }
}
