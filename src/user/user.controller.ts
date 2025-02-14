import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IConfirmAccountReturn, IUserReturn } from 'src/common/interfaces';
import { Response } from 'express';

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

  

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  

  

  

  
}
