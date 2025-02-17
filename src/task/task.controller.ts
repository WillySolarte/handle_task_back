/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IGeneralReturn, IGetTaskReturn } from 'src/common/interfaces';
import { Response } from 'express';
import { UserGuard } from 'src/user/user.guard';
import { UpdateStatusTaskDto } from './dto/update-status-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}


  @UseGuards(UserGuard)
  @Post('new-task/:projectId')
  async create(@Req() req, @Param('projectId') projectId: string, @Body() createTaskDto: CreateTaskDto, @Res() res: Response) {
    
    const userId = req.user.id
    const result: IGeneralReturn = await this.taskService.create(createTaskDto, projectId, userId);
    if(result.state === 'error'){
      return res.status(401).json(result)
    }

    return  res.status(201).json(result)
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }
  
  
  @Get('get-task/:projectId/:taskId')
  async findOne(@Param('projectId') projectId: string, @Param('taskId') taskId: string, @Res() res: Response) {

    const result: IGetTaskReturn = await this.taskService.findOne(projectId, taskId)
    if(result.state === 'error') return  res.status(401).json(result)
      
    return res.status(200).json(result) ;
  }
  
  @UseGuards(UserGuard)
  @Post('update-status/:projectId/:taskId')
  async updateStatus(@Req() req, @Param('projectId') projectId: string, @Param('taskId') taskId: string, @Body() updateStatusTaskDto: UpdateStatusTaskDto, @Res() res: Response){
    
    const userId = req.user.id;
    const result = await this.taskService.updateTaskStatus(updateStatusTaskDto, userId, projectId, taskId)
    if(result.state === 'error'){
      return  res.status(401).json(result)
    } 
    return res.status(200).json(result)
  }
  

  @UseGuards(UserGuard)
  @Patch('update-task/:projectId/:taskId')
  async update(@Req() req, @Param('projectId') projectId: string, @Param('taskId') taskId: string, @Body() updateTaskDto: UpdateTaskDto, @Res() res: Response) {
    
    const userId = req.user.id;
    const result = await this.taskService.update(updateTaskDto, projectId, taskId, userId);

    if(result?.state === 'error') return  res.status(401).json(result)

    return res.status(200).json(result)
  }
  @UseGuards(UserGuard)
  @Delete('delete-task/:projectId/:taskId')
  async remove(@Req() req, @Param('projectId') projectId: string, @Param('taskId') taskId: string, @Res() res: Response) {
    
    const userId = req.user.id;
    const result = await this.taskService.remove(projectId, taskId, userId)
    
    if(result?.state === 'error') return  res.status(401).json(result)

      return res.status(200).json(result)
  }
}
