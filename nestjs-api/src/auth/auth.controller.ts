import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, SigninDto } from "./dto";
// handle the requests

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: SigninDto) {
        return this.authService.signin(dto)
    }

    // ✅ Refresh endpoint
    @Post('refresh')
    refresh(@Body() body: { refresh_token: string }) {
        return this.authService.refresh(body);
    }

    // @Post('logout')
    // logout(@Req() req: any) {
    //     const userId = req.user.id; // Assuming user ID is stored in the request object
    //     return this.authService.logout(userId);
    // }   
}