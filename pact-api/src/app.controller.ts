import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth/jwt-auth.guard';
import { CurrentUser } from './common/decorators/current-user.decorator/current-user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @ApiOperation({ summary: 'Health check / App root' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth() //for swagger docs
  @ApiOperation({ summary: 'Get current logged-in user' })
  @Get('me')
  me(@CurrentUser() user: any) {
    return user;
  }
}
