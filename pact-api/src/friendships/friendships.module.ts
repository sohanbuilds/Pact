import { Module } from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import { FriendshipsController } from './friendships.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FriendGuard } from './friend/friend.guard';

@Module({
  imports: [PrismaModule],
  controllers: [FriendshipsController],
  providers: [FriendshipsService, FriendGuard],
  exports: [FriendGuard],
})
export class FriendshipsModule {}
