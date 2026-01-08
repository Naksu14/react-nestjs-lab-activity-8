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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user details' })
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
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been created.' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user' })
  @ApiResponse({ status: 200, description: 'The user has been updated.' })
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Req() req: any,
    @Body() updateData: Partial<User>,
  ): Promise<User | null> {
    return this.usersService.updateUser(req.user.id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'The user has been deleted.' })
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
