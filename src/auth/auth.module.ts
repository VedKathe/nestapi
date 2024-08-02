import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategies';
import { JwtStrategies } from './strategies/jwt.strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: "abc123",
      signOptions: { expiresIn: '1h' }
    }
    ),
    TypeOrmModule.forFeature([UserEntity]),
    MailerModule.forRoot({
      transport: {
        // For relay SMTP server set the host to smtp-relay.gmail.com
        // and for Gmail STMO server set it to smtp.gmail.com
        host: 'smtp.gmail.com',
        // For SSL and TLS connection
        secure: true,
        port: 465,
        auth: {
          // Account gmail address
          user: 'vmkathe@gmail.com',
          pass: 'xnnf mypa sres dnge'
        },
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategies],
})
export class AuthModule { }
