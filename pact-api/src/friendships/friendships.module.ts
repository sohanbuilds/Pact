import { Module } from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import { FriendshipsController } from './friendships.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [FriendshipsService],
  controllers: [FriendshipsController],
  imports: [PrismaModule]
})
export class FriendshipsModule {}
