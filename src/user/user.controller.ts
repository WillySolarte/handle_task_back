/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Post, Body, Res, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IConfirmAccountReturn, ILoginReturn, IUserReturn } from 'src/common/interfaces';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { UserGuard } from './user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    
    const result: IUserReturn = await this.userService.create(createUserDto);
    if(result.state === 'error'){
      
      return res.status(409).json(result)
    }
    
    return  res.status(200).json(result)
  }

  @Post('confirm-account/:token')
  async confirmAccount(@Param('token') param: string, @Res() res: Response){
    const result: IConfirmAccountReturn = await this.userService.confirmAccount(param)

    if(result.state === 'error'){
      
      return res.status(409).json(result)
    }
    
    return  res.status(200).json(result)
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    
    const result: ILoginReturn = await this.userService.loginUser(loginUserDto);
    if(result.state === 'error'){
      
      return res.status(409).json(result)
    }
    
    return  res.status(200).json(result)
  }

  @UseGuards(UserGuard)
  @Get('user-authenticated')
  getUserAuthenticated(@Req() req, @Res() res: Response) {

    

    return res.status(200).json({ msg: "Usuario autenticado", state: 'ok', data: req.user }) ;
  }



  @Get()
  findAll() {
    return this.userService.findAll();
  }

  

  

  

  
}
