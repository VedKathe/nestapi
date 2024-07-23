import { Controller, Post,Body, HttpException, UseGuards ,Get, Req, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPlayloadDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './guards/local.guard';
import { Request ,Response} from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { User } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string , user }> {
    return this.authService.login(loginDto)
  
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req:Request){
    console.log("Inside Controller");
    console.log(req.user);
    return req.user
  }

  @Post('signup')
  signUp(@Body() user: User): Promise<{ token: string }> {

   
    return this.authService.signUp(user);
  }
}
