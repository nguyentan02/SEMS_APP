import { Body, Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')

export class UserController {
    constructor(private userService: UserService) { }

    @Get('profile/:id')
    getProfile(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getProfileUser(id)
    }
    @Get()
    getAllUser(@Query() option: { page: number, name: string, role: number, isBan: boolean }) {
        return this.userService.getAllUser(option)
    }
}