import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator/current-user.decorator';
import { Get } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendshipsController {
  constructor(private friends: FriendshipsService, private prisma: PrismaService) {}

    @Post('request/:userId')
    sendRequest(
        @Param('userId') userId: string,
        @CurrentUser() user,
    ) {
        return this.friends.sendRequest(user.id, userId);
    }

    @Get('requests')
    getRequests(@CurrentUser() user) {
        return this.friends.getIncomingRequests(user.id);
    }

    @Post('accept/:requestId')
    accept(
        @Param('requestId') requestId: string,
        @CurrentUser() user,
    ) {
        return this.friends.acceptRequest(requestId, user.id);
    }

    @Post('block/:requestId')
    block(
        @Param('requestId') requestId: string,
        @CurrentUser() user,
    ) {
        return this.friends.blockRequest(requestId, user.id);
    }

    @Get('list')
    list(@CurrentUser() user) {
        return this.friends.listFriends(user.id);
    }
}
