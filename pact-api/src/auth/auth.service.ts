import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(email: string, username: string, password: string) {
    const hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, username, password: hash },
    });

    return this.sign(user.id);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      throw new UnauthorizedException();
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException();

    return this.sign(user.id);
  }

  async googleLogin(profile) {
    const email = profile.emails[0].value;

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          username: profile.displayName,
          googleId: profile.id,
        },
      });
    }

    return this.sign(user.id);
  }

  sign(userId: string) {
    return this.jwt.sign({ sub: userId });
  }
}
