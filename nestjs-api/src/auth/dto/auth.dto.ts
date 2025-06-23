import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  IsDefined ,
  IsEnum,

} from 'class-validator';

// import("../../generated/prisma").$Enums.UserRole;


import { UserRole } from '../../../generated/prisma';

export class AuthDto {
  @IsDefined({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;


  @IsDefined({ message: 'Password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;

  @IsDefined()
  @IsEnum(UserRole)
  role: UserRole;
}


export class SigninDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @MinLength(8)
  password: string;
}


