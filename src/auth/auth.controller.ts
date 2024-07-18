import { Controller, Post,Body, HttpException, UseGuards ,Get, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPlayloadDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UseGuards(LocalGuard)
  login(@Req() req:Request){
    return req.user
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req:Request){
    console.log("Inside Controller");
    console.log(req.user);
    return req.user
  }
}
