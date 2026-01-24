import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async createGroup(name: string, ownerId: string) {
    return this.prisma.group.create({
      data: {
        name,
        members: {
          create: {
            userId: ownerId,
            role: Role.ADMIN,
          },
        },
      },
    });
  }

  async addMember(groupId: string, userId: string, role: Role) {
    return this.prisma.groupMember.create({
      data: { groupId, userId, role },
    });
  }

  async getUserGroups(userId: string) {
    return this.prisma.group.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
    });
  }
}
