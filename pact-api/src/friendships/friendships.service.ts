import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FriendshipsService {

  constructor(private prisma: PrismaService) {}

  async sendRequest(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) {
        throw new BadRequestException('You cannot friend yourself');
    }

    // prevent duplicate requests
    const existing = await this.prisma.friendship.findFirst({
        where: {
        requesterId: fromUserId,
        receiverId: toUserId,
        },
    });

    if (existing) {
        throw new BadRequestException('Request already exists');
    }

    return this.prisma.friendship.create({
        data: {
        requesterId: fromUserId,
        receiverId: toUserId,
        },
    });
    }

    async getIncomingRequests(userId: string) {
        return this.prisma.friendship.findMany({
            where: {
                receiverId: userId,
                status: 'PENDING',
            },
            include: {
                requester: {
                    select: { id: true, username: true, email: true },
                },
            },
        });
    }

    async acceptRequest(requestId: string, userId: string) {
        const request = await this.prisma.friendship.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            throw new BadRequestException('Request not found');
        }

        if (request.receiverId !== userId) {
            throw new BadRequestException('Not allowed');
        }

        if (request.status !== 'PENDING') {
            throw new BadRequestException('Request already handled');
        }

        return this.prisma.friendship.update({
            where: { id: requestId },
            data: { status: 'ACCEPTED' },
        });
    }

    async blockRequest(requestId: string, userId: string) {
        const request = await this.prisma.friendship.findUnique({
            where: { id: requestId },
        });

        if (!request || request.receiverId !== userId) {
            throw new BadRequestException('Not allowed');
        }

        return this.prisma.friendship.update({
            where: { id: requestId },
            data: { status: 'BLOCKED' },
        });
    }

    async listFriends(userId: string) {
        return this.prisma.friendship.findMany({
            where: {
            status: 'ACCEPTED',
            OR: [
                { requesterId: userId },
                { receiverId: userId },
            ],
            },
            include: {
                requester: { select: { id: true, username: true } },
                receiver: { select: { id: true, username: true } },
            },
        });
    }
}