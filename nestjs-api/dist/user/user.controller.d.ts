import { User } from 'generated/prisma';
import { EditUserDto } from './dto/edit-user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(user: User): {
        email: string;
        password: string;
        role: import("generated/prisma").$Enums.UserRole;
        id: number;
        userId: string;
        firstName: string | null;
        lastName: string | null;
        subscribedCrops: string[];
        createdAt: Date;
        updatedAt: Date;
    };
    editUser(userId: number, dto: EditUserDto): Promise<any>;
}
