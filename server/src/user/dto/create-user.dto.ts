import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role';

export class CreateUserDto {
  @MinLength(3, { message: `Name should minimum 3 characters long.` })
  @IsNotEmpty({ message: `Must provide email.` })
  name: string;

  @IsEmail({}, { message: `Provide valid email.` })
  @IsNotEmpty({ message: `Must provide email.` })
  email: string;

  @IsString({ message: `Password must be string.` })
  @IsNotEmpty({ message: `Must provide email.` })
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
