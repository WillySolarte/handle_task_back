
import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectB } from './schema/projectB.schema';
import { UserA } from 'src/user/schema/userA.schema';
import { TaskB } from 'src/task/schema/taskB.schema';

@Injectable()
export class ProjectService {

  constructor(
    @InjectModel(ProjectB.name) private projectBModel: Model<ProjectB>,
    @InjectModel(UserA.name) private userAModel: Model<UserA>,
    @InjectModel(TaskB.name) private taskBModel: Model<TaskB>,

  ) { }

  async create(createProjectDto: CreateProjectDto, userId: string) {

    const project = new this.projectBModel(createProjectDto);
    project.manager = new Types.ObjectId(userId);

    try {
      await project.save();
      return 'Proyecto creado correctamente'
    } catch (error) {

      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error en la conexión');
    }
  }

  async findAll(userId: string) {
    const objectId = new Types.ObjectId(userId);

    try {
      const projects = await this.projectBModel.find({
        $or: [
          { manager: objectId },
          { team: { $in: [userId] } },
        ],
      }).exec();
      return projects
      
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error en la conexión');
    }
    
  }

  async findOne(id: string, userId: string) {

    try {
      const project = await this.projectBModel.findById(id).populate({
        path: 'task',
        model: 'TaskB' 
      });

      if (!project) {
        throw new NotFoundException('Proyecto no encontrado');

      }
      
      const isManager = project.manager.toString() === userId;
      const isTeamMember = project.team.some(member => member.toString() === userId);

      if (!isManager && !isTeamMember) {
        throw new UnauthorizedException('Acción no válida');

      }
      return project;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error en la conexión');

    }

  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {


    try {

      const project = await this.projectBModel.findById(id);


      if (!project) {
        throw new NotFoundException('Proyecto no encontrado');
      }

      if (project.manager.toString() !== userId) {
        throw new UnauthorizedException('Acción no válida');
      }

      project.projectName = updateProjectDto.projectName;
      project.clientName = updateProjectDto.clientName;
      project.description = updateProjectDto.description;


      await project.save();
      
      return 'Proyecto actualizado correctamente';
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error en la conexión');
    }
  }

  async remove(id: string, userId: string) {
    const project = await this.projectBModel.findById(id);
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    if (project.manager.toString() !== userId) {
      throw new UnauthorizedException('Solo el manager puede eliminar el proyecto');
    }

    try {

      await this.taskBModel.deleteMany({ _id: { $in: project.task } });

      await project.deleteOne();
      return 'Proyecto eliminado correctamente';
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error en la conexión');
    }
  }

  async findMemberByEmail(email: string) {
    try {
      const user = await this.userAModel.findOne({ email });
      
      if (!user){
        throw new NotFoundException('Usuario no encontrado');
      } 

      const objetOutput = {
        _id: user.id as Types.ObjectId,
        email: user.email,
        name: user.name
      }

      return objetOutput;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error en la conexión');
    }
  }

  async getProjectTeam(projectId: string) {
    try {
      const project = await this.projectBModel.findById(projectId).populate({ path: 'team', model: 'UserA', select: 'id name email' });
      if (!project) throw new NotFoundException('Proyecto no encontrado');
      
      return project.team;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error en la conexión');
    }
  }

  async addMemberById(projectId: string, userId: string) {
    try {
      const user = await this.userAModel.findById(userId);
      if (!user)  throw new NotFoundException('Usuario no encontrado');

      const project = await this.projectBModel.findById(projectId);
      
      if (!project) throw new NotFoundException('Proyecto no encontrado');
      
      
      if (project.team.some(teamMember => teamMember.toString() === userId.toString())) {
        
        throw new BadRequestException('El usuario ya está agregado');
      }

      if(project.manager.toString() === userId){
        throw new BadRequestException('El usuario es manager');
      }

      project.team.push(user.id as Types.ObjectId);
      
      await project.save();
      return 'Usuario agregado correctamente'
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error en la conexión');
    }

  }

  async removeMemberById(projectId: string, userId: string, idUserActive: string) {
    try {
      
      const project = await this.projectBModel.findById(projectId);
      if (!project) throw new NotFoundException('Proyecto no encontrado');
      
      if (!project.team.some(teamMember => teamMember.toString() === userId)) {
        throw new BadRequestException('El usuario no está agregado');
      }

      if(project.manager.toString() !== idUserActive){
        throw new UnauthorizedException('Solo el manager puede eliminar');
      }

      project.team = project.team.filter(teamMember => teamMember.toString() !== userId);
      await project.save();
      return 'Usuario eliminado correctamente'
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error en la conexión');
    }
  }




}
