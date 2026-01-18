import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FriendGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const currentUserId = request.user.id;
    const targetUserId =
      request.params.userId ||
      request.body.userId ||
      request.query.userId;

    if (!targetUserId) {
      throw new ForbiddenException('Target user not specified');
    }

    const friendship = await this.prisma.friendship.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          {
            requesterId: currentUserId,
            receiverId: targetUserId,
          },
          {
            requesterId: targetUserId,
            receiverId: currentUserId,
          },
        ],
      },
    });

    if (!friendship) {
      throw new ForbiddenException('You are not friends');
    }

    return true;
  }
}
