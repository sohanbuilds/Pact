import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiCookieAuth, ApiParam } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';

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
}
