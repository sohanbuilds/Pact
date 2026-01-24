import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const userId = req.user.id;
    const groupId = req.params.id || req.body.groupId;

    const membership = await this.prisma.groupMember.findFirst({
      where: { userId, groupId },
    });

    if (!membership) throw new ForbiddenException();

    req.role = membership.role;
    return true;
  }
}
