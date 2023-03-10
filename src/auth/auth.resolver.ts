import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthType } from './dto/auth.type';
import { AuthInput } from './dto/auth.input';

@Resolver('Auth')
export class AuthResolver {
    constructor(private authService: AuthService){}

    @Mutation(()=> AuthType)
    public async login(
        @Args('data') data: AuthInput
    ): Promise<AuthType>{
        const response = await this.authService.validateUser(data);
        return{
            user: response.user,
            token: response.token
        }
    }

    @Mutation(() => String)
    public async forgotPassword(
        @Args('email') email: string
    ): Promise<String>{
        return await this.authService.forgotPassword(email);
    }
}
