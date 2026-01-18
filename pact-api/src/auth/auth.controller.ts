import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res) {
    const token = await this.auth.login(dto.email, dto.password);
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
    return res.send({ success: true });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res({ passthrough: true }) res) {
    const token = await this.auth.googleLogin(req.user);
    res.cookie('token', token, { httpOnly: true });
    res.redirect(process.env.FRONTEND_URL ?? 'http://localhost:3000');
  }

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res) {
    const token = await this.auth.register(dto.email, dto.username, dto.password);
    res.cookie('token', token, { httpOnly: true });
    return res.send({ success: true });
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res) {
    res.clearCookie('token');
    return res.send({ success: true });
  }
}
