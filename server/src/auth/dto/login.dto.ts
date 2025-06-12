import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: `Must provide valid email.` })
  @IsNotEmpty({ message: `Provide email please.` })
  email!: string;

  @IsString({ message: 'Password should be string.' })
  @IsNotEmpty({ message: `Provide email please.` })
  password!: string;
}
