
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserGuard } from 'src/user/user.guard';
import { IUserActive } from 'src/common/interfaces';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  

  @UseGuards(UserGuard)
  @Post('new-project')
   create(@Req() req: Request & { user: IUserActive },  @Body() createProjectDto: CreateProjectDto) {
    const userId: IUserActive['id'] =  req.user.id;

    return this.projectService.create(createProjectDto, userId!);
    
  }
  

  @UseGuards(UserGuard)
  @Get('find-all')
  async findAll(@Req() req: Request & { user: IUserActive }) {
    
    const userId: IUserActive['id'] = req.user.id
    return await this.projectService.findAll(userId!);
  }
  
  @UseGuards(UserGuard)
  @Get('get-project/:id')
  async findOne(@Req() req: Request & { user: IUserActive }, @Param('id') id: string) {
    const userId: IUserActive['id'] = req.user.id
    return await this.projectService.findOne(id, userId!)

    
  }
 
  @UseGuards(UserGuard)
  @Patch('update-project/:id')
  async update(@Req() req: Request & { user: IUserActive }, @Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    
    const userId: IUserActive['id'] = req.user.id
    return await this.projectService.update(id, updateProjectDto, userId!);
    
  }
  
  @UseGuards(UserGuard)
  @Delete('delete-project/:id')
  async remove(@Req() req: Request & { user: IUserActive }, @Param('id') id: string) {
    
    const userId: IUserActive['id'] = req.user.id
    return await this.projectService.remove(id, userId!);
  }


  @Post('find-member-by-email')
  async findMemberByEmail(@Body('email') email: string) {
    
    return await this.projectService.findMemberByEmail(email);
    
    
  }

  @Get('get-project-team/:projectId')
  async getProjectTeam(@Param('projectId') projectId: string) {

    return await this.projectService.getProjectTeam(projectId);
    
    
  }

  @Post('add-member-by-id/:projectId')
  async addMemberById(@Param('projectId') projectId: string, @Body('id') userId: string) {
    return await this.projectService.addMemberById(projectId, userId);
    

  }
  
  @UseGuards(UserGuard)
  @Delete('remove-member-by-id/:projectId/:userId')
  async removeMemberById(@Req() req: Request & { user: IUserActive }, @Param('projectId') projectId: string, @Param('userId') userId: string) {
    
    const idUserActive: IUserActive['id'] = req.user.id
    return await this.projectService.removeMemberById(projectId, userId, idUserActive!);
    
  }
}
