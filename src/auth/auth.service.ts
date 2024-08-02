import { Injectable, ConflictException, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { AuthPlayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { log } from 'console';
import { use } from 'passport';


const fakeUser = [
  {
    id: 1,
    username: "vedant",
    password: "kathe123"
  },
  {
    id: 2,
    username: "kathe",
    password: "vedant123"
  }
]

@Injectable()
export class AuthService {

  constructor(@InjectRepository(UserEntity)
  private usersRepository: Repository<UserEntity>, private jwtService: JwtService, private readonly mailerService: MailerService) {

  }

  validateUser({ username, password }: AuthPlayloadDto) {
    const findUser = fakeUser.find((user) => user.username === username)

    if (!findUser) return null

    if (password === findUser.password) {
      const { password, ...user } = findUser;
      return this.jwtService.sign(user)
    }
  }

  async signUp(signUpDto: User): Promise<{ success:boolean }> {
    const { username, email, password } = signUpDto;
    const role = 'u'
    const hashedPassword = await bcrypt.hash(password, 10);

    // const user = await this.usersRepository.create({
    //   username,
    //   email,
    //   password: hashedPassword,
    //   role
    // });

    // try {
    //   await this.usersRepository.save(user);
    // } catch (error) {
    //   // Check if the error is a duplicate key error
    //   if (error.code === '23505') { // PostgreSQL unique violation error code
    //     throw new ConflictException('Username or email already exists');
    //   } else {
    //     throw error; // Rethrow other types of errors
    //   }
    // }

    const token = this.jwtService.sign({ email:email });

    const url = `https://acomm.netlify.app/verify?token=${token}`;

    const text = `<p>Welcome to the application. To confirm the email address, <a herf="${url}"> click here:  ${url}</a></p>`;

    return this.sendMail(
      email, 
      "Email Verification",
      username,
      url
    );

   
  }

  async signUpAdmin(signUpDto: User): Promise<{ token: string, user: any }> {
    const { username, email, password } = signUpDto;
    const role = 'a'
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      // Check if the error is a duplicate key error
      if (error.code === '23505') { // PostgreSQL unique violation error code
        throw new ConflictException('Username or email already exists');
      } else {
        throw error; // Rethrow other types of errors
      }
    }

    console.log(user);

    const token = this.jwtService.sign({ id: user.id });

    const userData = {
      id: user.id,
      username: user.username,
      role: user.role
    }

    return { token, user: userData };
  }

  async login(loginDto: LoginDto): Promise<{ token: string, user: any }> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if(!user.isEmailConfirmed){
      throw new ForbiddenException('Email not verified');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }



    const token = this.jwtService.sign({ id: user.id });

    const userData = {
      id: user.id,
      username: user.username,
      role: user.role
    }


    return { token, user: userData };
  }

  

  async confirmEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    this.usersRepository.update({ email }, {
      isEmailConfirmed: true
    });
   
    
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: 'abc123',
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async sendMail(email:string,subject:string,username:string,url:string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'vmkathe@gmail.com', // sender address
        subject: subject, // Subject line
        template: './confirmation',
        context:{
          name:username,
          url:url
        }
      });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }
}
