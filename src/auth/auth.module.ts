import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategies';
import { JwtStrategies } from './strategies/jwt.strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: "abc123",
      signOptions: { expiresIn: '1h' }
    }
    )],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategies],
})
export class AuthModule { }
