import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Req() req: any): Promise<User | null> {
    // request.user is attached by JwtStrategy validate()
    const user = req.user;
    if (!user) return null;
    // if user is full entity, return as-is, otherwise fetch from DB
    if (user.id) return this.usersService.getUserById(user.id);
    return null;
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Req() req: any,
    @Body() updateData: Partial<User>,
  ): Promise<User | null> {
    return this.usersService.updateUser(req.user.id, updateData);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
