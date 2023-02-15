import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { AuthInput } from './dto/auth.input';
import { compareSync } from 'bcrypt';
import { AuthType } from './dto/auth.type';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { Mailer } from 'src/common/helpers/mailer';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private mailer: Mailer
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

    async forgotPassword(email: string): Promise<String>{
        const user = await this.userService.getUserByEmail(email);

        if(email !== user.email){
            throw new UnauthorizedException('Email não cadastrado!');
        }
        const token = await this.jwtToken(user);

        const mail = await this.mailer.sendMail(email, `seu token: ${token}`);

        return mail;
    }


    private async jwtToken(user: User): Promise<string>{
        const payload = {username: user.name, sub: user.id};
        return this.jwtService.signAsync(payload);
    }
}
