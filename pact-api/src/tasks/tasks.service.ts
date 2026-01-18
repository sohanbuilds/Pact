import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}
    async createPersonalTask(userId: string, dto: CreateTaskDto) {
        return this.prisma.task.create({
            data: {
            title: dto.title,
            description: dto.description,
            priority: dto.priority,
            deadline: dto.deadline,
            type: 'PERSONAL',
            ownerId: userId,
            },
        });
    }

    async getMyPersonalTasks(userId: string) {
        return this.prisma.task.findMany({
            where: {
                ownerId: userId,
                type: 'PERSONAL',
            },
            orderBy: [
                { priority: 'desc' },
                { deadline: 'asc' },
            ],
        });
    }

    async updateTask(taskId: string, userId: string, dto: CreateTaskDto) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
        });
    
        if (!task || task.ownerId !== userId) {
            throw new ForbiddenException();
        }
    
        return this.prisma.task.update({
            where: { id: taskId },
            data: {
                title: dto.title,
                description: dto.description,
                priority: dto.priority,
                deadline: dto.deadline,
            },
        });
    }

    async deleteTask(taskId: string, userId: string) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task || task.ownerId !== userId) {
            throw new ForbiddenException();
        }

        return this.prisma.task.delete({
            where: { id: taskId },
        });
    }
}
