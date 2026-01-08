import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' })
    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        try {
            const user = await this.authService.validateUser(email, password);
            const token = await this.authService.login(user);
            return token;
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }   
    }


}
