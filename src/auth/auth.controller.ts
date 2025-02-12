import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {


    constructor(private authService: AuthService){}

    @Get()
    getAllUsers(@Req() request: Request, @Res() response: Response){
        return response.json({msg: this.authService.getUsers(), state: 'ok'}).status(200)
    }
    @Post('/:id')
    createUser(@Param('id') param: string){
        console.log(param)
    }
}
