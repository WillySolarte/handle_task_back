
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IUserActive } from 'src/common/interfaces';
import { UserGuard } from 'src/user/user.guard';
import { UpdateStatusTaskDto } from './dto/update-status-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}


  @UseGuards(UserGuard)
  @Post('new-task/:projectId')
  async create(@Req() req: Request & { user: IUserActive }, @Param('projectId') projectId: string, @Body() createTaskDto: CreateTaskDto) {
    
    const userId: IUserActive['id'] = req.user.id;
    return await this.taskService.create(createTaskDto, projectId, userId!);
   
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }
  
  
  @Get('get-task/:projectId/:taskId')
  async findOne(@Param('projectId') projectId: string, @Param('taskId') taskId: string) {

    return await this.taskService.findOne(projectId, taskId)
    
  }
  
  @UseGuards(UserGuard)
  @Post('update-status/:projectId/:taskId')
  updateStatus(@Req() req: Request & { user: IUserActive }, @Param('projectId') projectId: string, @Param('taskId') taskId: string, @Body() updateStatusTaskDto: UpdateStatusTaskDto){
    
    const userId: IUserActive['id'] = req.user.id;

    return  this.taskService.updateTaskStatus(updateStatusTaskDto, userId!, projectId, taskId)
    
  }
  

  @UseGuards(UserGuard)
  @Patch('update-task/:projectId/:taskId')
  async update(@Req() req: Request & { user: IUserActive }, @Param('projectId') projectId: string, @Param('taskId') taskId: string, @Body() updateTaskDto: UpdateTaskDto) {
    
    const userId : IUserActive['id'] = req.user.id;
    return await this.taskService.update(updateTaskDto, projectId, taskId, userId!);

    
  }
  @UseGuards(UserGuard)
  @Delete('delete-task/:projectId/:taskId')
  async remove(@Req() req: Request & { user: IUserActive }, @Param('projectId') projectId: string, @Param('taskId') taskId: string) {
    
    const userId : IUserActive['id'] = req.user.id;
    return await this.taskService.remove(projectId, taskId, userId!)
    
    
  }
}
