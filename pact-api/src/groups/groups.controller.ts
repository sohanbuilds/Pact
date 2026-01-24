import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Groups')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private groups: GroupsService) {}

  @ApiOperation({ summary: 'Create group' })
  @Post()
  create(@Body('name') name: string, @CurrentUser() user) {
    return this.groups.createGroup(name, user.id);
  }

  @ApiOperation({ summary: 'Add member to group' })
  @Post(':id/invite')
  invite(
    @Param('id') groupId: string,
    @Body('userId') userId: string,
    @Body('role') role: Role,
  ) {
    return this.groups.addMember(groupId, userId, role);
  }

  @ApiOperation({ summary: 'List my groups' })
  @Get()
  list(@CurrentUser() user) {
    return this.groups.getUserGroups(user.id);
  }
}
