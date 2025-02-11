import { Controller, Get } from '@nestjs/common';

@Controller({})
export class AuthController {

    @Get('/auth')
    getAllUsers(){
        return 'Probando end point'
    }
}
