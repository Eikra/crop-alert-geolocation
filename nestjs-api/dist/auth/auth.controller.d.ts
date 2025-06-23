import { AuthService } from "./auth.service";
import { AuthDto, SigninDto } from "./dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: AuthDto): Promise<{
        email: string;
        role: import("generated/prisma").$Enums.UserRole;
        id: number;
        userId: string;
        firstName: string | null;
        lastName: string | null;
        subscribedCrops: string[];
        createdAt: Date;
        updatedAt: Date;
    } | undefined>;
    signin(dto: SigninDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(body: {
        refresh_token: string;
    }): Promise<{
        access_token: string;
    }>;
}
