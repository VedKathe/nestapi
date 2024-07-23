import { Injectable ,ConflictException,UnauthorizedException} from '@nestjs/common';
import { AuthPlayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

const fakeUser = [
    {
        id:1,
        username:"vedant",
        password:"kathe123"
    },
    {
        id:2,
        username:"kathe",
        password:"vedant123"
    }
]

@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,private jwtService: JwtService){

    }

    validateUser({username, password}:AuthPlayloadDto){
        const findUser = fakeUser.find((user) => user.username === username)

        if(!findUser) return null

        if(password === findUser.password){
            const {password , ...user} = findUser;
           return this.jwtService.sign(user)
        }
    }

    async signUp(signUpDto: User): Promise<{ token: string ,role: string}> {
        const { username, email, password } = signUpDto;
        const role = 'u'
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
    
        return { token , role:user.role };
      }

    async login(loginDto: LoginDto): Promise<{ token: string , user: any}> {
        const { email, password } = loginDto;
    
        const user = await this.usersRepository.findOne({
          where: { email },
        });
    
        if (!user) {
          throw new UnauthorizedException('Invalid email or password');
        }
    
        const isPasswordMatched = await bcrypt.compare(password, user.password);
    
        if (!isPasswordMatched) {
          throw new UnauthorizedException('Invalid email or password');
        }
    
        const token = this.jwtService.sign({ id: user.id });
        
        const userData = {
          id: user.id,
          username: user.username,
          role:user.role
        }


        return { token , user:userData };
      }
}
