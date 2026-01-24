import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiCookieAuth, ApiParam } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { FriendGuard } from '../friendships/friend/friend.guard';
import { CreatePrivateTaskDto } from './dto/create-private-task.dto/create-private-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';

@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private tasks: TasksService) {}
    
    @ApiOperation({ summary: 'Create a personal task' })
    @ApiBody({ type: CreateTaskDto })
    @Post('personal')
    createPersonal(
        @Body() dto: CreateTaskDto,
        @CurrentUser() user,
    ) {
        return this.tasks.createPersonalTask(user.id, dto);
    }

    @ApiOperation({ summary: 'Get my personal tasks' })
    @Get('personal')
        getMine(@CurrentUser() user) {
        return this.tasks.getMyPersonalTasks(user.id);
    }

    @ApiOperation({ summary: 'Update my personal task' })
    @ApiParam({ name: 'id', example: 'task-id' })
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: CreateTaskDto,
        @CurrentUser() user,
    ) {
        return this.tasks.updateTask(id, user.id, dto);
    }

    @ApiOperation({ summary: 'Delete my personal task' })
    @ApiParam({ name: 'id', example: 'task-id' })
    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user) {
        return this.tasks.deleteTask(id, user.id);
    }

    @ApiOperation({ summary: 'Create a private task for a friend' })
    @ApiBody({ type: CreatePrivateTaskDto })
    @UseGuards(JwtAuthGuard, FriendGuard)
    @Post('private')
    createPrivate(
        @Body() dto: CreatePrivateTaskDto,
        @CurrentUser() user,
    ) {
        return this.tasks.createPrivateTask(user.id, dto);
    }

    @ApiOperation({ summary: 'Get my private (friend) tasks' })
    @Get('private')
    getPrivate(@CurrentUser() user) {
        return this.tasks.getMyPrivateTasks(user.id);
    }

    @ApiOperation({ summary: 'Update private task (owner or assignee)' })
    @ApiParam({ name: 'id', example: 'task-id' })
    @Patch('private/:id')
    updatePrivate(
        @Param('id') id: string,
        @Body() dto: UpdateTaskDto,
        @CurrentUser() user,
    ) {
        return this.tasks.updatePrivateTask(id, user.id, dto);
    }

    @ApiOperation({ summary: 'Delete private task (owner only)' })
    @ApiParam({ name: 'id', example: 'task-id' })
    @Delete('private/:id')
    removePrivate(
        @Param('id') id: string,
        @CurrentUser() user,
    ) {
        return this.tasks.deletePrivateTask(id, user.id);
    }
}
