import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'firstname', 'lastname', 'isActive'],
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstname', 'lastname', 'isActive'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    try {
      return await this.usersRepository.save(newUser);
    } catch (error) {
      // handle duplicate email unique constraint from the database
      const isDuplicate =
        error &&
        (error.code === 'ER_DUP_ENTRY' ||
          error.errno === 1062 ||
          error.code === '23505');
      if (isDuplicate) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async updateUser(
    id: number,
    updateData: Partial<User>,
  ): Promise<User | null> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    await this.usersRepository.update(id, updateData);
    return this.usersRepository.findOneBy({ id });
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
