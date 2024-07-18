import { Injectable } from '@nestjs/common';
import { AuthPlayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

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

    constructor(private jwtService: JwtService){

    }

    validateUser({username, password}:AuthPlayloadDto){
        const findUser = fakeUser.find((user) => user.username === username)

        if(!findUser) return null

        if(password === findUser.password){
            const {password , ...user} = findUser;
           return this.jwtService.sign(user)
        }
    }
}
