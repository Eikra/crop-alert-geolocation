import { UserRole } from '../../../generated/prisma';
export declare class AuthDto {
    email: string;
    password: string;
    role: UserRole;
}
export declare class SigninDto {
    email: string;
    password: string;
}
