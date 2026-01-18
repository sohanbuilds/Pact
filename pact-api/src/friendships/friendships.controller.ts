import { ApiTags, ApiOperation, ApiCookieAuth, ApiParam } from '@nestjs/swagger';
import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator/current-user.decorator';
import { Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@ApiCookieAuth() //will mark the apis protected as cookie auth is required
@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendshipsController {
  constructor(private friends: FriendshipsService, private prisma: PrismaService) {}
    @ApiOperation({ summary: 'Send friend request to a user' })
    @ApiParam({ name: 'userId', example: '772f842d-eb6d-495a-b157-99a76639fb8e' })
    @Post('request/:userId')
    sendRequest(
        @Param('userId') userId: string,
        @CurrentUser() user,
    ) {
        return this.friends.sendRequest(user.id, userId);
    }

    @ApiOperation({ summary: 'Get incoming friend requests' })
    @Get('requests')
    getRequests(@CurrentUser() user) {
        return this.friends.getIncomingRequests(user.id);
    }

    @ApiOperation({ summary: 'Accept a friend request' })
    @ApiParam({
        name: 'requestId',
        example: '1ac3330c-ec58-4f30-9f47-a7fc926632d8',
    })
    @Post('accept/:requestId')
    accept(
        @Param('requestId') requestId: string,
        @CurrentUser() user,
    ) {
        return this.friends.acceptRequest(requestId, user.id);
    }

    @ApiOperation({ summary: 'Block a friend request' })
    @ApiParam({
        name: 'requestId',
        example: '1ac3330c-ec58-4f30-9f47-a7fc926632d8',
    })
    @Post('block/:requestId')
    block(
        @Param('requestId') requestId: string,
        @CurrentUser() user,
    ) {
        return this.friends.blockRequest(requestId, user.id);
    }

    @ApiOperation({ summary: 'List all accepted friends' })
    @Get('list')
    list(@CurrentUser() user) {
        return this.friends.listFriends(user.id);
    }
}
