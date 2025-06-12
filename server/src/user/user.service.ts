import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepo.findOne({
        where: { email },
        relations: ['contracts'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user by email');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = this.userRepo.create(createUserDto);
      return await this.userRepo.save(newUser);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('User creation failed');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepo.find();
    } catch {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);
      const updatedUser = Object.assign(user, updateUserDto);
      return await this.userRepo.save(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('User update failed');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.userRepo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
