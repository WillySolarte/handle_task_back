/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserGuard } from 'src/user/user.guard';
import { IGeneralReturn } from 'src/common/interfaces';
import { Response } from 'express';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  

  @UseGuards(UserGuard)
  @Post('new-project')
  async create(@Req() req,  @Body() createProjectDto: CreateProjectDto, @Res() res: Response) {
    const userId = await req.user.id;

    const result: IGeneralReturn = await this.projectService.create(createProjectDto, userId);
    if(result.state === 'error'){
      return res.status(401).json(result)
    }
    
    return  res.status(201).json(result);
  }
  

  @UseGuards(UserGuard)
  @Get('find-all')
  findAll(@Req() req) {
    
    return this.projectService.findAll(req.user.id);
  }
  
  @UseGuards(UserGuard)
  @Get('get-project/:id')
  async findOne(@Req() req, @Param('id') id: string, @Res() res: Response) {
    const project: IGeneralReturn = await this.projectService.findOne(id, req.user.id)

    if(project.state === 'error'){
      return res.status(401).json(project)
    }
    
    return res.status(200).json(project);;
  }
 
  @UseGuards(UserGuard)
  @Patch('update-project/:id')
  async update(@Req() req, @Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Res() res: Response) {
    
    const userId: string = req.user.id
    const result: IGeneralReturn = await this.projectService.update(id, updateProjectDto, userId);
    if(result.state === 'error'){
      return res.status(401).json(result)
    }
    return res.status(200).json(result);;
  }
  
  @UseGuards(UserGuard)
  @Delete('delete-project/:id')
  remove(@Req() req, @Param('id') id: string) {
    
    const userId: string = req.user.id
    return this.projectService.remove(id, userId);
  }


  @Post('find-member-by-email')
  async findMemberByEmail(@Body('email') email: string, @Res() res: Response) {
    
    const result = await this.projectService.findMemberByEmail(email);
    
    if(result.state === 'error') return res.status(401).json(result.msg)
      
    return  res.status(200).json(result.data);
  }

  @Get('get-project-team/:projectId')
  async getProjectTeam(@Param('projectId') projectId: string, @Res() res: Response) {

    const result = await this.projectService.getProjectTeam(projectId);
    
    if(result.state === 'error') return res.status(401).json(result)

      return  res.status(200).json(result);
  }

  @Post('add-member-by-id/:projectId')
  async addMemberById(@Param('projectId') projectId: string, @Body('id') userId: string, @Res() res: Response) {
    const result = await this.projectService.addMemberById(projectId, userId);
    if(result.state === "error") return res.status(401).json(result.msg)
    return res.status(200).json(result);

  }
  
  @UseGuards(UserGuard)
  @Delete('remove-member-by-id/:projectId/:userId')
  async removeMemberById(@Req() req, @Param('projectId') projectId: string, @Param('userId') userId: string, @Res() res: Response) {
    
    const idUserActive = req.user.id
    const result = await this.projectService.removeMemberById(projectId, userId, idUserActive);
    
    if(result.state === 'error') return res.status(401).json(result.msg)
      
    return res.status(200).json(result);
  }
}
