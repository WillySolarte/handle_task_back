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
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request, @Req() request) {
    const userId = request.user._id;
    return this.projectService.create(createProjectDto, userId);
  }
  

  @UseGuards(UserGuard)
  @Get('find-all')
  findAll(@Req() req) {
    
    return this.projectService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
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
