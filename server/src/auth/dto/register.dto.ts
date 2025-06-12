import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../user/enums/user-role';

export class RegisterDto {
  @IsString({ message: 'Password should be string.' })
  @MinLength(4)
  name!: string;

  @IsEmail({}, { message: `Must provide valid email.` })
  @IsNotEmpty({ message: `Provide email please.` })
  email!: string;

  @IsString({ message: 'Password should be string.' })
  @IsNotEmpty({ message: `Provide email please.` })
  password!: string;

  @IsEnum(UserRole)
  role: UserRole = UserRole.CLIENT;
}
