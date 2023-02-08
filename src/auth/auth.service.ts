import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { AuthInput } from './dto/auth.input';
import { compareSync } from 'bcrypt';
import { AuthType } from './dto/auth.type';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
        ){}

    async validateUser(data: AuthInput): Promise<AuthType>{
        const user = await this.userService.getUserByEmail(data.email);

        const validPassword = compareSync(data.password, user.password);

        if(!validPassword){
            throw new UnauthorizedException('Incorrect Password');
        }
        const token = await this.jwtToken(user);

        return {
            user, token
        }
    }

    private async jwtToken(user: User): Promise<string>{
        const payload = {username: user.name, sub: user.id};
        return this.jwtService.signAsync(payload);
    }
}
