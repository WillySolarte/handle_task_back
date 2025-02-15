import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schema/project.schema';
import { Model, ObjectId, Types } from 'mongoose';

@Injectable()
export class ProjectService {

  constructor(
      @InjectModel(Project.name) private projectModel: Model<Project>,
      
  
    ) { }

  async create(createProjectDto: CreateProjectDto, userId: string) {
    
    const project = new this.projectModel(createProjectDto);
    project.manager = new Types.ObjectId(userId);

    try {
      await project.save();
      return { message: 'Proyecto creado correctamente' };
    } catch (error) {
      throw new Error('Error al consultar la BD');
    }
  }

  async findAll(userId: string) {
    const objectId = new Types.ObjectId(userId);
    const projects = await this.projectModel.find({
      $or: [
        { manager: objectId },
        { team: objectId },
      ],
    }).exec();
    return projects
  }

  async findOne(id: string, userId: string) {
    const project = await this.projectModel.findById(id).populate('task');
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    const isManager = project.manager.toString() === userId;
    const isTeamMember = project.team.some(member => member.toString() === userId);

    if (!isManager && !isTeamMember) {
      throw new UnauthorizedException('Acción no válida');
    }

    return project;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
