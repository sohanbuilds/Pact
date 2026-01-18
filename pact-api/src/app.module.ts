import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { GoogleStrategy } from './auth/google.strategy/google.strategy';
import { JwtStrategy } from './auth/jwt.strategy/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { FriendshipsModule } from './friendships/friendships.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }), PrismaModule, AuthModule, FriendshipsModule, TasksModule,
],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, JwtStrategy],
})
export class AppModule {}
