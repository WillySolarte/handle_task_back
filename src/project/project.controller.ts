/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserGuard } from 'src/user/user.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  

  @UseGuards(UserGuard)
  @Post('new-project')
  async create(@Req() req,  @Body() createProjectDto: CreateProjectDto) {
    const userId = await req.user.id;
    
    return this.projectService.create(createProjectDto, userId);
  }
  

  @UseGuards(UserGuard)
  @Get('find-all')
  findAll(@Req() req) {
    
    return this.projectService.findAll(req.user.id);
  }
  
  @UseGuards(UserGuard)
  @Get('get-project/:id')
  async findOne(@Req() req, @Param('id') id: string) {
    const project = await this.projectService.findOne(id, req.user.id)
    
    return project;
  }
 

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
